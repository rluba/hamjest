'use strict';

var _ = require('lodash')
	, Matcher = require('./Matcher')
	, acceptingMatcher = require('./IsEqual').acceptingMatcher
	;

var Is = acceptingMatcher(function Is(innerMatcher) {
	return _.create(new Matcher(), {
		matches: function (actualValue) {
			return innerMatcher.matches(actualValue);
		},
		describeTo: function (description) {
			description
				.append('is ')
				.appendDescriptionOf(innerMatcher);
		},
		describeMismatch: function (value, description) {
			return innerMatcher.describeMismatch(value, description);
		},
		getExpectedForDiff: innerMatcher.getExpectedForDiff,
		formatActualForDiff: innerMatcher.formatActualForDiff
	});
});

Is.is = function (innerMatcher) {
	return new Is(innerMatcher);
};

module.exports = Is;
