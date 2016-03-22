'use strict';

const _ = require('lodash');
const TypeSafeMatcher = require('./TypeSafeMatcher');
const FeatureMatcher = require('./FeatureMatcher');

module.exports = function (matcherOrValue) {
	const innerMatcher = new FeatureMatcher(matcherOrValue, 'a collection or string with size', 'size', (item) => _.size(item));
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isString(actual) || _.isObject(actual);
		},
		matchesSafely: innerMatcher.matches,
		describeTo: innerMatcher.describeTo,
		describeMismatchSafely: innerMatcher.describeMismatch
	});
};
