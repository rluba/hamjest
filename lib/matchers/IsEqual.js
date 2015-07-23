'use strict';

var _ = require('lodash')
	, Matcher = require('./Matcher')
	;

function IsEqual(expectedValue) {
	return _.create(new Matcher(), {
		matches: function (actualValue) {
			return _.isEqual(expectedValue, actualValue);
		},
		describeTo: function (description) {
			description.appendValue(expectedValue);
		},
		getDiffItems: function (actual) {
			return {
				expected: expectedValue,
				actual: actual
			};
		}
	});
}

IsEqual.equalTo = function (operand) {
	return new IsEqual(operand);
};

module.exports = IsEqual;
