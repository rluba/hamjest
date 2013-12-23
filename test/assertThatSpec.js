'use strict';

var _ = require('lodash-node')
	, AssertionError = require('assertion-error')
	, assertThat = require('../lib/assertThat')
	, Matcher = require('../lib/matcher')
	, assertTrue = require('./asserts').assertTrue
	, assertEquals = require('./asserts').assertEquals
	;

var TestMatcher = function (matchesFn) {
	Matcher.call(this, {
		matches: matchesFn,
		describeTo: function (description) {
			description.append('Matcher description');
		}
	});
};
TestMatcher.prototype = _.create(Matcher.prototype, { 'constructor': TestMatcher });

describe('assertThat', function () {
	it('should do nothing on success', function () {

		assertThat('truth', new TestMatcher(function () { return true; }));

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
});
