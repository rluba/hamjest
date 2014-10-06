'use strict';

var _ = require('lodash')
	, IsArray = require('./IsArray')
	, acceptingMatcher = require('./IsEqual').acceptingMatcher
	;
var promiseAgnostic = require('./promiseAgnostic');

var IsArrayWithItem = acceptingMatcher(function IsArrayWithItem(matcher) {
	return _.create(new IsArray(), {
		matchesSafely: function (actual) {
			var results = _.map(actual, function (value) {
				return matcher.matches(value);
			});

			return promiseAgnostic.matchesAggregate(results, _.any);
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
			var results = _.map(actual, function (value) {
				return matcher.matches(value);
			});

			var first = true;
			description.append('[');
			return promiseAgnostic.describeMismatchAggregate(results, function (result, index) {
				if (!first) {
					description.append(', ');
				}
				first = false;
				return matcher.describeMismatch(actual[index], description);
			}, function () {
				description.append(']');
			});
		}
	});
});

IsArrayWithItem.hasItem = function (matcherOrValue) {
	return new IsArrayWithItem(matcherOrValue);
};

module.exports = IsArrayWithItem;
