'use strict';

var _ = require('lodash');
var Description = require('./../Description');
var TypeSafeMatcher = require('./TypeSafeMatcher');
var acceptingMatcher = require('./IsEqual').acceptingMatcher;
var isMatcher = require('./Matcher').isMatcher;

module.exports = acceptingMatcher(function hasDescription(descriptionMatcher) {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return isMatcher(actual);
		},
		matchesSafely: function (actual) {
			var actualDescription = new Description()
				.appendDescriptionOf(actual)
				.get();
			return descriptionMatcher.matches(actualDescription);
		},
		describeTo: function (description) {
			description.append('a matcher with description: ')
				.appendDescriptionOf(descriptionMatcher);
		},
		describeMismatchSafely: function (actual, description) {
			description.append('matcher description ');
			var actualDescription = new Description()
				.appendDescriptionOf(actual)
				.get();
			descriptionMatcher.describeMismatch(actualDescription, description);
		}
	});
});
