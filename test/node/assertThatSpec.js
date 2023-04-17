'use strict';

const assert = require('assert');
const AssertionError = require('assertion-error');

const __ = require('../..');
const TestMatcher = require('./TestMatcher');

describe('assertThat', () => {
	it('should do nothing on success', () => {

		__.assertThat('truth', new TestMatcher());
	});

	it('should pass value to matcher', () => {
		const input = 'assertion value';
		let passedValue;

		__.assertThat(input, new TestMatcher((value) => {
			passedValue = value;
			return true;
		}));

		assert.ok(passedValue === input, 'Received: ' + passedValue);
	});

	it('should wrap non-matcher values in `equalTo()` (without message)', () => {

		assert.doesNotThrow(() => __.assertThat(true, true));
		assert.doesNotThrow(() => __.assertThat('some string', 'some string'));
		assert.doesNotThrow(() => __.assertThat({a: 'value'}, {a: 'value'}));
		__.assertThat(() => __.assertThat('some value', 'other value'), __.throws(__.instanceOf(AssertionError)));
	});

	it('should wrap non-matcher values in `equalTo()` (with a message)', () => {

		assert.doesNotThrow(() => __.assertThat('Boolean', true, true));
		assert.doesNotThrow(() => __.assertThat('String', 'some string', 'some string'));
		assert.doesNotThrow(() => __.assertThat('Objects', {a: 'value'}, {a: 'value'}));
		__.assertThat(() => __.assertThat('Mismatching strings', 'some value', 'other value'), __.throws(__.instanceOf(AssertionError)));
	});

	it('should format assertion message if matcher fails', () => {
		let thrown;

		try {
			__.assertThat('real value', new TestMatcher(() => false));
		} catch (e) {
			thrown = e;
		}

		assert.ok(thrown instanceof AssertionError, 'Should throw AssertionError. Threw ' + thrown);
		assert.equal(thrown.message, '\nExpected: Matcher description\n     but: was "real value"');
	});

	it('should prepend message, if available', () => {
		let thrown;

		try {
			__.assertThat('Assertion message', 'real value', new TestMatcher(() => false));
		} catch (e) {
			thrown = e;
		}

		assert.ok(thrown instanceof AssertionError, 'Should throw AssertionError. Threw ' + thrown);
		assert.equal(thrown.message, 'Assertion message\nExpected: Matcher description\n     but: was "real value"');
	});

	it('should pass diff representations to AssertionError', () => {
		let thrown;

		const testMatcher = new TestMatcher(() => false);
		testMatcher.getExpectedForDiff = () => {
			return 'expected for diff';
		};
		testMatcher.formatActualForDiff = function (actual) {
			return 'actual for diff: ' + actual;
		};

		try {
			__.assertThat('actual value', testMatcher);
		} catch (e) {
			thrown = e;
		}

		assert.equal(thrown.expected, 'expected for diff');
		assert.equal(thrown.actual, 'actual for diff: actual value');
	});

	it('should throw if matcher returns a promise', () => {
		let thrown;

		try {
			__.assertThat('a value', new TestMatcher(() => Promise.resolve(true)));
		} catch (e) {
			thrown = e;
		}

		assert.ok(thrown instanceof AssertionError, 'Should throw AssertionError. Threw ' + thrown);
		assert.equal(thrown.message, 'Matcher returned a promise instead of a boolean - use promiseThat for promising matchers!');
	});

	it('should call expect().nothing() function if it’s available (to suppress jasmine’s "no expectations" error)', () => {
		let expectNothingWasCalled = false;
		global.expect = () => {
			return {
				nothing() {
					expectNothingWasCalled = true;
				}
			};
		};

		__.assertThat('truth', __.is(__.anything()));

		assert.equal(expectNothingWasCalled, true);
	});
});
