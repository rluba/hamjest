'use strict';

var _ = require('lodash-node')
	, Matcher = require('./Matcher')
	;

var IsEqual = function (expectedValue) {
	Matcher.call(this, {
		matches: function (actualValue) {
			return _.isEqual(expectedValue, actualValue);
		},
		describeTo: function (description) {
			description.appendValue(expectedValue);
		}
	});
};
IsEqual.prototype = _.create(Matcher.prototype, { 'constructor': IsEqual });

var equalTo = function (operand) {
	return new IsEqual(operand);
};

var asMatcher = function (valueOrMatcher) {
	if(Matcher.isMatcher(valueOrMatcher)) {
		return valueOrMatcher;
	}
	else {
		return equalTo(valueOrMatcher);
	}
};

var acceptingMatcher = function (innerFunction) {
	return function (valueOrMatcher) {
		return innerFunction.call(this, asMatcher(valueOrMatcher));
	};
};

module.exports = {
	IsEqual: IsEqual,
	equalTo: equalTo,
	asMatcher: asMatcher,
	acceptingMatcher: acceptingMatcher
};
