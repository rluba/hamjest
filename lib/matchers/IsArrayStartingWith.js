'use strict';

const _create = require('lodash/create');
const _every = require('lodash/every');
const _map = require('lodash/map');
const IsArray = require('./IsArray');
const asMatcher = require('../utils/asMatcher');
const promiseAgnostic = require('./promiseAgnostic');

const IsArrayStartingWith = function IsArrayStartingWith(itemsOrMatchers) {
	const matchers = _map(itemsOrMatchers, asMatcher);
	return _create(new IsArray(), {
		matchesSafely: function (actual) {
			if (actual.length < matchers.length) {
				return false;
			}

			const results = _map(matchers, (matcher, index) => {
				return matcher.matches(actual[index]);
			});

			return promiseAgnostic.matchesAggregate(results, _every);
		},
		describeTo: function (description) {
			description.appendList('[', ', ', ', …]', matchers);
		},
		describeMismatchSafely: function (actual, description) {
			const results = _map(matchers, (matcher, index) => {
				if (index < actual.length) {
					return matcher.matches(actual[index]);
				}
			});

			let first = true;
			return promiseAgnostic.describeMismatchAggregate(results, (result, index) => {
				if (result || index >= actual.length) {
					return;
				}

				if (!first) {
					description.append('\n');
				}
				first = false;

				description
					.append('item ')
					.append(index)
					.append(': ');
				return matchers[index].describeMismatch(actual[index], description);
			}, () => {
				if (!first) {
					description.append('\n');
				}

				if (actual.length < matchers.length) {
					description.indented(() => description.appendList('missing:\n', ',\n', '', matchers.slice(actual.length)));
				}
			});
		}
	});
};

IsArrayStartingWith.startsWithItems = function () {
	return new IsArrayStartingWith(arguments);
};

module.exports = IsArrayStartingWith;
