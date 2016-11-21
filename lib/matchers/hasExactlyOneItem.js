'use strict';

const _ = require('lodash');
const IsArray = require('./IsArray');
const acceptingMatcher = require('../utils/acceptingMatcher');
const promiseAgnostic = require('./promiseAgnostic');

module.exports = acceptingMatcher((matcher) => {
	return _.create(new IsArray(), {
		matchesSafely: function (actual) {
			const results = _.map(actual, (value) => {
				return matcher.matches(value);
			});

			return promiseAgnostic.matchesAggregate(results, (results) => _.filter(results).length === 1);
		},
		describeTo: function (description) {
			description
				.append('an array containing exactly one instance of ')
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

			let firstMatch = true;
			let firstMismatch = true;
			return promiseAgnostic.describeMismatchAggregate(results, (result, index) => {
				if (!result) {
					return;
				}

				if (firstMatch) {
					firstMatch = false;
					description.append('array contained multiple instances:');
				}
				return description.indented(() => {
					description.append('\n');
					description
						.append('item ')
						.append(index)
						.append(': ')
						.appendValue(actual[index]);
				});
			}, () => promiseAgnostic.describeMismatchAggregate(results, (result, index) => {
				if (result) {
					return;
				}

				if (!firstMatch && firstMismatch) {
					firstMismatch = false;
					description.append('\nother items:');
				}
				return description.indented(() => {
					description.append('\n');
					description
						.append('item ')
						.append(index)
						.append(': ');
					return description.indented(() => matcher.describeMismatch(actual[index], description));
				});
			}));
		}
	});
});
