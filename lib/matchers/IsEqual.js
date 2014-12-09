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
		getExpectedForDiff: function () { return expectedValue; },
		formatActualForDiff: function (actual) { return actual; }
	});
}

IsEqual.equalTo = function (operand) {
	return new IsEqual(operand);
};

IsEqual.asMatcher = function (valueOrMatcher) {
	if (Matcher.isMatcher(valueOrMatcher)) {
		return valueOrMatcher;
	}
	else {
		return IsEqual.equalTo(valueOrMatcher);
	}
};

IsEqual.acceptingMatcher = function (innerFunction) {
	return function (valueOrMatcher) {
		return innerFunction.call(this, IsEqual.asMatcher(valueOrMatcher));
	};
};

module.exports = IsEqual;
