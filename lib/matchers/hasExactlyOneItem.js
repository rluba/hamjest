'use strict';

const _create = require('lodash/create');
const _filter = require('lodash/filter');
const _map = require('lodash/map');
const IsArray = require('./IsArray');
const promiseAgnostic = require('./promiseAgnostic');
const asMatcher = require('../utils/asMatcher');

module.exports = function (valueOrMatcher) {
	const matcher = asMatcher(valueOrMatcher);
	return _create(new IsArray(), {
		matchesSafely: function (actual) {
			const results = _map(actual, (value) => {
				return matcher.matches(value);
			});

			return promiseAgnostic.matchesAggregate(results, (results) => _filter(results).length === 1);
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
			const results = _map(actual, (value) => {
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
};
