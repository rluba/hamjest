'use strict';

var _ = require('lodash')
	, TypeSafeMatcher = require('./TypeSafeMatcher')
	, FeatureMatcher = require('./FeatureMatcher')
	;

function IsCollectionWithSize(matcherOrValue) {
	var innerMatcher = new FeatureMatcher(matcherOrValue, 'a collection with size', 'size', function (item) {
		return _.size(item);
	});
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isString(actual) || _.isObject(actual);
		},
		matchesSafely: innerMatcher.matches,
		describeTo: innerMatcher.describeTo,
		describeMismatchSafely: innerMatcher.describeMismatch
	});
}

IsCollectionWithSize.hasSize = function (matcherOrValue) {
	return new IsCollectionWithSize(matcherOrValue);
};

module.exports = IsCollectionWithSize;
