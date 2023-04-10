'use strict';

const _create = require('lodash/create');
const _every = require('lodash/every');
const _map = require('lodash/map');
const IsArray = require('./IsArray');
const asMatcher = require('../utils/asMatcher');
const promiseAgnostic = require('./promiseAgnostic');

function IsArrayContaining(itemsOrMatchers) {
	const matchers = _map(itemsOrMatchers, asMatcher);
	return _create(new IsArray(), {
		matchesSafely: function (actual) {
			if (actual.length !== matchers.length) {
				return false;
			}

			const results = _map(matchers, (matcher, index) => {
				return matcher.matches(actual[index]);
			});

			return promiseAgnostic.matchesAggregate(results, _every);
		},
		describeTo: function (description) {
			description.appendList('[', ', ', ']', matchers);
		},
		describeMismatchSafely: function (actual, description) {
			const results = _map(actual, (value, index) => {
				if (matchers.length > index) {
					return matchers[index].matches(value);
				}
			});

			let first = true;
			return promiseAgnostic.describeMismatchAggregate(results, (result, index) => {
				if (result || matchers.length <= index || actual.length <= index) {
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

				if (actual.length > matchers.length) {
					description.indented(() => description.appendList('not matched:\n', ',\n', '', actual.slice(matchers.length)));
				} else if (actual.length < matchers.length) {
					description.indented(() => description.appendList('missing:\n', ',\n', '', matchers.slice(actual.length)));
				}
			});
		}
	});
}

IsArrayContaining.contains = function () {
	return new IsArrayContaining(arguments);
};

module.exports = IsArrayContaining;
