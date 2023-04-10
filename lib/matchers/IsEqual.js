'use strict';

const _create = require('lodash/create');
const _isEqual = require('lodash/isEqual');
const Matcher = require('./Matcher');

function IsEqual(expectedValue) {
	return _create(new Matcher(), {
		matches: function (actualValue) {
			return _isEqual(expectedValue, actualValue);
		},
		describeTo: function (description) {
			description.appendValue(expectedValue);
		},
		getExpectedForDiff: function () { return expectedValue; },
		formatActualForDiff: function (actual) { return actual; }
	});
}

IsEqual.equalTo = function (operand) {
	return new IsEqual(operand);
};

module.exports = IsEqual;
