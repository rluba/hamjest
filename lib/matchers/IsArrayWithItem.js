'use strict';

var _ = require('lodash')
	, IsArray = require('./IsArray')
	, acceptingMatcher = require('./IsEqual').acceptingMatcher
	;

var IsArrayWithItem = acceptingMatcher(function IsArrayWithItem(matcher) {
	return _.create(new IsArray(), {
		matchesSafely: function (actual) {
			var matched = false;
			_.forEach(actual, function (value) {
				if (matcher.matches(value)) {
					matched = true;
					return false;
				}
			});
			return matched;
		},
		describeTo: function (description) {
			description
				.append('an array containing ')
				.appendDescriptionOf(matcher);
		},
		describeMismatchSafely: function (actual, description) {
			if (actual.length === 0) {
				description.append('was empty');
				return;
			}

			description.append('[');
			var first = true;
			_.forEach(actual, function (value) {
				if (!first) {
					description.append(', ');
				}
				first = false;
				matcher.describeMismatch(value, description);
			});
			description.append(']');
		}
	});
});

IsArrayWithItem.hasItem = function (matcherOrValue) {
	return new IsArrayWithItem(matcherOrValue);
};

module.exports = IsArrayWithItem;
