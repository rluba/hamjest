'use strict';

const _ = require('lodash');
const TypeSafeMatcher = require('./TypeSafeMatcher');
const acceptingMatcher = require('../utils/acceptingMatcher');
const promiseAgnostic = require('./promiseAgnostic');

const Every = acceptingMatcher((matcher) => {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isArray(actual) || _.isObject(actual);
		},
		matchesSafely: function (actual) {
			const results = _.map(actual, (value) => {
				return matcher.matches(value);
			});

			return promiseAgnostic.matchesAggregate(results, _.every);
		},
		describeTo: function (description) {
			description
				.append('every item is ')
				.appendDescriptionOf(matcher);
		},
		describeMismatchSafely: function (actual, description) {
			let results;
			if (_.isArray(actual)) {
				results  = _.map(actual, (value) => {
					return matcher.matches(value);
				});
			} else {
				results  = _.mapValues(actual, (value) => {
					return matcher.matches(value);
				});
			}

			return promiseAgnostic.describeMismatchAggregate(results, (result, key) => {
				if (result) {
					return;
				}

				description.append('\nitem ').appendValue(key).append(' ');
				return description.indented(() => matcher.describeMismatch(actual[key], description));
			});
		}
	});
});

Every.everyItem = function (valueOrMatcher) {
	return new Every(valueOrMatcher);
};

module.exports = Every;
