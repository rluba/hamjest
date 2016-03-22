'use strict';

const _ = require('lodash');
const IsArray = require('./IsArray');
const acceptingMatcher = require('../utils/acceptingMatcher');
const promiseAgnostic = require('./promiseAgnostic');

const IsArrayWithItem = acceptingMatcher((matcher) => {
	return _.create(new IsArray(), {
		matchesSafely: function (actual) {
			const results = _.map(actual, (value) => {
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
			const results = _.map(actual, (value) => {
				return matcher.matches(value);
			});

			let first = true;
			description.append('[');
			return promiseAgnostic.describeMismatchAggregate(results, (result, index) => {
				if (!first) {
					description.append(', ');
				}
				first = false;
				return matcher.describeMismatch(actual[index], description);
			}, () => {
				description.append(']');
			});
		}
	});
});

IsArrayWithItem.hasItem = function (matcherOrValue) {
	return new IsArrayWithItem(matcherOrValue);
};

module.exports = IsArrayWithItem;
