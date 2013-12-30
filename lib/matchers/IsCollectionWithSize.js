'use strict';

var _ = require('lodash-node')
	, TypeSafeMatcher = require('./TypeSafeMatcher')
	, acceptingMatcher = require('./IsEqual').acceptingMatcher
	;

var IsCollectionWithSize = acceptingMatcher(function IsCollectionWithSize(matcher) {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isString(actual) || _.isObject(actual);
		},
		matchesSafely: function (actual) {
			return matcher.matches(_.size(actual));
		},
		describeTo: function (description) {
			description
				.append('a collection with size ')
				.appendDescriptionOf(matcher);
		},
		describeMismatchSafely: function (actual, description) {
			description
				.appendValue(actual)
				.append(' has size ')
				.appendValue(_.size(actual));
		}
	});
});

IsCollectionWithSize.hasSize = function (matcherOrValue) {
	return new IsCollectionWithSize(matcherOrValue);
};

module.exports = IsCollectionWithSize;
