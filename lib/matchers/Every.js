'use strict';

const _create = require('lodash/create');
const _every = require('lodash/every');
const _isArray = require('lodash/isArray');
const _isObject = require('lodash/isObject');
const _map = require('lodash/map');
const _mapValues = require('lodash/mapValues');
const TypeSafeMatcher = require('./TypeSafeMatcher');
const promiseAgnostic = require('./promiseAgnostic');
const asMatcher = require('../utils/asMatcher');

function Every(valueOrMatcher) {
	const matcher = asMatcher(valueOrMatcher);
	return _create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _isArray(actual) || _isObject(actual);
		},
		matchesSafely: function (actual) {
			const results = _map(actual, (value) => {
				return matcher.matches(value);
			});

			return promiseAgnostic.matchesAggregate(results, _every);
		},
		describeTo: function (description) {
			description
				.append('every item is ')
				.appendDescriptionOf(matcher);
		},
		describeMismatchSafely: function (actual, description) {
			let results;
			if (_isArray(actual)) {
				results  = _map(actual, (value) => {
					return matcher.matches(value);
				});
			} else {
				results  = _mapValues(actual, (value) => {
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
}

Every.everyItem = function (valueOrMatcher) {
	return new Every(valueOrMatcher);
};

module.exports = Every;
