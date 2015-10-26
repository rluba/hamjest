'use strict';

var _ = require('lodash');
var Description = require('./../Description');
var TypeSafeMatcher = require('./TypeSafeMatcher');
var isMatcher = require('./Matcher').isMatcher;

function matches(target) {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return isMatcher(actual);
		},
		matchesSafely: function (actual) {
			return actual.matches(target);
		},
		describeTo: function (description) {
			description.append('a matcher matching ')
				.appendValue(target);
		},
		describeMismatchSafely: function (actual, description) {
			var mismatchDescription = new Description();
			actual.describeMismatch(target, mismatchDescription);

			description
				.append('matcher with description ')
				.appendValue(new Description()
					.appendDescriptionOf(actual)
					.get()
				)
				.append(' failed to match and explained: ')
				.appendValue(mismatchDescription.get());
		}
	});
}

module.exports = matches;
