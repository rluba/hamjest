'use strict';

var _ = require('lodash')
	, TypeSafeMatcher = require('./TypeSafeMatcher')
	, acceptingMatcher = require('./IsEqual').acceptingMatcher
	;
var promiseAgnostic = require('./promiseAgnostic');

var Every = acceptingMatcher(function Every(matcher) {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isArray(actual) || _.isObject(actual);
		},
		matchesSafely: function (actual) {
			var results = _.map(actual, function (value) {
				return matcher.matches(value);
			});

			return promiseAgnostic.matchesAggregate(results, _.all);
		},
		describeTo: function (description) {
			description
				.append('every item is ')
				.appendDescriptionOf(matcher);
		},
		describeMismatchSafely: function (actual, description) {
			var results;
			if (_.isArray(actual)) {
				results  = _.map(actual, function (value) {
					return matcher.matches(value);
				});
			} else {
				results  = _.mapValues(actual, function (value) {
					return matcher.matches(value);
				});
			}

			var first = true;
			return promiseAgnostic.describeMismatchAggregate(results, function (result, key) {
				if (result) {
					return;
				}

				if (!first) {
					description.append(', ');
				}
				first = false;
				description.append('item ').appendValue(key).append(' ');
				matcher.describeMismatch(actual[key], description);
			});
		}
	});
});

Every.everyItem = function (matcherOrValue) {
	return new Every(matcherOrValue);
};

module.exports = Every;
