'use strict';

var q = require('q');
var AssertionError = require('assertion-error')
	, assertThat = require('../lib/assertThat')
	, assertTrue = require('./asserts').assertTrue
	, assertEquals = require('./asserts').assertEquals
	, TestMatcher = require('./TestMatcher')
	;

describe('assertThat', function () {
	it('should do nothing on success', function () {

		assertThat('truth', new TestMatcher());

	});

	it('should pass value to matcher', function () {
		var input = 'assertion value';
		var passedValue;

		assertThat(input, new TestMatcher(function (value) {
			passedValue = value;
			return true;
		}));

		assertTrue(passedValue === input, 'Received: ' + passedValue);
	});

	it('should format assertion message if matcher fails', function () {
		var thrown;

		try {
			assertThat('real value', new TestMatcher(function () {
				return false;
			}));
		}
		catch (e) {
			thrown = e;
		}

		assertTrue(thrown instanceof AssertionError, 'Should throw AssertionError. Threw ' + thrown);
		assertEquals(thrown.message, '\nExpected: Matcher description\n     but: was "real value"');
	});

	it('should prepend message, if available', function () {
		var thrown;

		try {
			assertThat('Assertion message', 'real value', new TestMatcher(function () {
				return false;
			}));
		}
		catch (e) {
			thrown = e;
		}

		assertTrue(thrown instanceof AssertionError, 'Should throw AssertionError. Threw ' + thrown);
		assertEquals(thrown.message , 'Assertion message\nExpected: Matcher description\n     but: was "real value"');
	});

	it('should pass diff representations to AssertionError', function () {
		var thrown;

		var testMatcher = new TestMatcher(function () { return false; });
		testMatcher.getExpectedForDiff = function () {
			return 'expected for diff';
		};
		testMatcher.formatActualForDiff = function (actual) {
			return 'actual for diff: ' + actual;
		};

		try {
			assertThat('actual value', testMatcher);
		}
		catch (e) {
			thrown = e;
		}

		assertEquals(thrown.expected, 'expected for diff');
		assertEquals(thrown.actual, 'actual for diff: actual value');
	});

	it('should throw if matcher returns a promise', function () {
		var thrown;

		try {
			assertThat('a value', new TestMatcher(function () {
				return q(true);
			}));
		}
		catch (e) {
			thrown = e;
		}

		assertTrue(thrown instanceof AssertionError, 'Should throw AssertionError. Threw ' + thrown);
		assertEquals(thrown.message , 'Matcher returned a promise instead of a boolean - use promiseThat for promising matchers!');
	});
});
