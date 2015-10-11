'use strict';

var _ = require('lodash');
var Description = require('./../Description');
var TypeSafeMatcher = require('./TypeSafeMatcher');
var anything = require('./IsAnything').anything;
var asMatcher = require('./IsEqual').asMatcher;
var isMatcher = require('./Matcher').isMatcher;

function failsToMatch(target, descriptionMatcher) {
	descriptionMatcher = descriptionMatcher ? asMatcher(descriptionMatcher) : anything();
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return isMatcher(actual);
		},
		matchesSafely: function (actual) {
			if (actual.matches(target)) {
				return false;
			}

			var mismatchDescription = new Description();
			actual.describeMismatch(target, mismatchDescription);
			return descriptionMatcher.matches(mismatchDescription.get());
		},
		describeTo: function (description) {
			description.append('a matcher failing to match ')
				.appendValue(target)
				.append(' with mismatch description "')
				.appendDescriptionOf(descriptionMatcher)
				.append('"');
		},
		describeMismatchSafely: function (actual, description) {
			description
				.append('matcher with description ')
				.appendValue(new Description()
					.appendDescriptionOf(actual)
					.get()
				);

			if (actual.matches(target)) {
				description.append(' matched');
				return;
			}
			else {
				var mismatchDescription = new Description();
				actual.describeMismatch(target, mismatchDescription);

				description.append(': mismatch description ');
				descriptionMatcher.describeMismatch(mismatchDescription.get(), description);
			}
		}
	});
}

module.exports = failsToMatch;
