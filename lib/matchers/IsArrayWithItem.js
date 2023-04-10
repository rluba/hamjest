'use strict';

const _create = require('lodash/create');
const _map = require('lodash/map');
const _some = require('lodash/some');
const IsArray = require('./IsArray');
const promiseAgnostic = require('./promiseAgnostic');
const asMatcher = require('../utils/asMatcher');

function IsArrayWithItem(valueOrMatcher) {
	const matcher = asMatcher(valueOrMatcher);
	return _create(new IsArray(), {
		matchesSafely: function (actual) {
			const results = _map(actual, (value) => {
				return matcher.matches(value);
			});

			return promiseAgnostic.matchesAggregate(results, _some);
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
			const results = _map(actual, (value) => {
				return matcher.matches(value);
			});

			return promiseAgnostic.describeMismatchAggregate(results, (__result, index) => {
				description.append('\n');
				description
					.append('item ')
					.append(index)
					.append(': ');
				return description.indented(() => matcher.describeMismatch(actual[index], description));
			});
		}
	});
}

IsArrayWithItem.hasItem = function (valueOrMatcher) {
	return new IsArrayWithItem(valueOrMatcher);
};

module.exports = IsArrayWithItem;
