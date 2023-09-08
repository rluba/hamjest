'use strict';

const _create = require('lodash/create');
const _every = require('lodash/every');
const _map = require('lodash/map');
const IsArray = require('./IsArray');
const asMatcher = require('../utils/asMatcher');
const promiseAgnostic = require('./promiseAgnostic');

const IsArrayEndingWith = function IsArrayEndingWith(itemsOrMatchers) {
	const matchers = _map(itemsOrMatchers, asMatcher);
	return _create(new IsArray(), {
		matchesSafely: function (actual) {
			if (actual.length < matchers.length) {
				return false;
			}

			const results = _map(matchers, (matcher, index) => {
				return matcher.matches(actual[actual.length - matchers.length + index]);
			});

			return promiseAgnostic.matchesAggregate(results, _every);
		},
		describeTo: function (description) {
			description.appendList('[…, ', ', ', ']', matchers);
		},
		describeMismatchSafely: function (actual, description) {
			const results = _map(matchers, (matcher, index) => {
				const actualIndex = actual.length - matchers.length + index;
				if (actualIndex >= 0) {
					return matcher.matches(actual[actualIndex]);
				}
			});

			let first = true;
			return promiseAgnostic.describeMismatchAggregate(results, (result, index) => {
				const actualIndex = actual.length - matchers.length + index;
				if (result || actualIndex < 0) {
					return;
				}

				if (!first) {
					description.append('\n');
				}
				first = false;

				description
					.append('item ')
					.append(actualIndex)
					.append(': ');
				return matchers[index].describeMismatch(actual[actualIndex], description);
			}, () => {
				if (!first) {
					description.append('\n');
				}

				if (actual.length < matchers.length) {
					description.indented(() => description.appendList('missing:\n', ',\n', '', matchers.slice(0, matchers.length - actual.length)));
				}
			});
		}
	});
};

IsArrayEndingWith.endsWithItems = function () {
	return new IsArrayEndingWith(arguments);
};

module.exports = IsArrayEndingWith;

