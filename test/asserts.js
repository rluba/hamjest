'use strict';

var _ = require('lodash')
	, AssertionError = require('assertion-error')
	;

var asserts = {
	assertTrue: function (value, message) {
		if (value !== true) {
			throw new AssertionError(message, {}, asserts.assertTrue);
		}
	},
	assertEquals: function (actual, expected, message) {
		message = message ? message + ' ' : '';
		if (!_.isEqual(actual, expected)) {
			throw new AssertionError(message + 'Expected "' + expected + '" but was "' + actual + '"', {}, asserts.assertEquals);
		}
	},
	assertFalse: function (value, message) {
		if (value !== false) {
			throw new AssertionError(message, {}, asserts.assertFalse);
		}
	},
	fail: function (message) {
		throw new AssertionError(message, {}, asserts.fail);
	}
};

module.exports = asserts;
