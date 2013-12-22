'use strict';

var _ = require('lodash-node')
	, asserts = require('../lib/asserts')
	, AssertionError = require('assertion-error')
	;

var Matcher = function (matchesFn) {
	_.extend(this, {
		matches: matchesFn,
		describeTo: function (description) {
			description.append('Matcher description');
		},
		describeMismatch: function (value, description) {
			description.append('Mismatch description with value: ' + value);
		}
	});
};

var assertTrue = function (value, message) {
	if (!value) {
		throw new Error(message);
	}
};

describe('assertThat', function () {
	var assertThat = asserts.assertThat;

	it('should do nothing on success', function () {

		assertThat('truth', new Matcher(function () { return true; }));

	});

	it('should pass value to matcher', function () {
		var input = 'assertion value';
		var passedValue;

		assertThat(input, new Matcher(function (value) {
			passedValue = value;
			return true;
		}));

		assertTrue(passedValue === input, 'Received: ' + passedValue);
	});

	it('should format assertion message if matcher fails', function () {
		var thrown;

		try {
			assertThat('assertion value', new Matcher(function () {
				return false;
			}));
		}
		catch (e) {
			thrown = e;
		}

		assertTrue(thrown instanceof AssertionError, 'Should throw AssertionError. Threw ' + thrown);
		assertTrue(thrown.message === '\nExpected: Matcher description\n     but: Mismatch description with value: assertion value',
			'Threw error with message: ' + thrown.message);
	});

	it('should prepend message, if available', function () {
		var thrown;

		try {
			assertThat('Assertion message', 'assertion value', new Matcher(function () {
				return false;
			}));
		}
		catch (e) {
			thrown = e;
		}

		assertTrue(thrown instanceof AssertionError, 'Should throw AssertionError. Threw ' + thrown);
		assertTrue(thrown.message === 'Assertion message\nExpected: Matcher description\n     but: Mismatch description with value: assertion value',
			'Threw error with message: ' + thrown.message);
	});
});
