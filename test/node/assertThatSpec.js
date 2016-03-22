'use strict';

const AssertionError = require('assertion-error');
const Bluebird = require('bluebird');

const __ = require('../..');
const assertTrue = require('./asserts').assertTrue;
const assertEquals = require('./asserts').assertEquals;
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

		assertTrue(passedValue === input, 'Received: ' + passedValue);
	});

	it('should format assertion message if matcher fails', () => {
		let thrown;

		try {
			__.assertThat('real value', new TestMatcher(() => false));
		}
		catch (e) {
			thrown = e;
		}

		assertTrue(thrown instanceof AssertionError, 'Should throw AssertionError. Threw ' + thrown);
		assertEquals(thrown.message, '\nExpected: Matcher description\n     but: was "real value"');
	});

	it('should prepend message, if available', () => {
		let thrown;

		try {
			__.assertThat('Assertion message', 'real value', new TestMatcher(() => false));
		}
		catch (e) {
			thrown = e;
		}

		assertTrue(thrown instanceof AssertionError, 'Should throw AssertionError. Threw ' + thrown);
		assertEquals(thrown.message, 'Assertion message\nExpected: Matcher description\n     but: was "real value"');
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
		}
		catch (e) {
			thrown = e;
		}

		assertEquals(thrown.expected, 'expected for diff');
		assertEquals(thrown.actual, 'actual for diff: actual value');
	});

	it('should throw if matcher returns a promise', () => {
		let thrown;

		try {
			__.assertThat('a value', new TestMatcher(() => Bluebird.resolve(true)));
		}
		catch (e) {
			thrown = e;
		}

		assertTrue(thrown instanceof AssertionError, 'Should throw AssertionError. Threw ' + thrown);
		assertEquals(thrown.message, 'Matcher returned a promise instead of a boolean - use promiseThat for promising matchers!');
	});
});
