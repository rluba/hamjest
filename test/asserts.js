'use strict';

var _ = require('lodash-node')
	, AssertionError = require('assertion-error')
	;

var asserts = {
	assertTrue: function (value, message) {
		if (!value) {
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
		if (value) {
			throw new AssertionError(message, {}, asserts.assertFalse);
		}
	},
};

module.exports = asserts;
