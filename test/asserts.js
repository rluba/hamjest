'use strict';

var _ = require('lodash-node')
	;

var asserts = {
	assertTrue: function (value, message) {
		if (!value) {
			throw new Error(message);
		}
	},
	assertEquals: function (actual, expected, message) {
		message = message ? message + ' ' : '';
		if (!_.isEqual(actual, expected)) {
			throw new Error(message + 'Expected "' + expected + '" but was "' + actual + '"');
		}
	},
	assertFalse: function (value, message) {
		if (value) {
			throw new Error(message);
		}
	},
};

module.exports = asserts;
