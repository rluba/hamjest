'use strict';

var _ = require('lodash-node')
	, Matcher = require('./Matcher')
	, acceptingMatcher = require('./IsEqual').acceptingMatcher
	;

var IsNot = acceptingMatcher(function IsNot(innerMatcher) {
	return _.create(new Matcher(), {
		matches: function (actualValue) {
			return !innerMatcher.matches(actualValue);
		},
		describeTo: function (description) {
			description
				.append('not ')
				.appendDescriptionOf(innerMatcher);
		},
		describeMismatch: function (value, description) {
			innerMatcher.describeMismatch(value, description);
		}
	});
});

IsNot.not = function (innerMatcher) {
	return new IsNot(innerMatcher);
};

module.exports = IsNot;
