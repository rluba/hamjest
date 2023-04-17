'use strict';

const _create = require('lodash/create');
const _every = require('lodash/every');
const _map = require('lodash/map');
const _mapValues = require('lodash/mapValues');
const Matcher = require('./Matcher');
const promiseAgnostic = require('./promiseAgnostic');

function AllOf(matchers) {
	return _create(new Matcher(), {
		matches: function (actual) {
			const results = _map(matchers, (matcher) => {
				return matcher.matches(actual);
			});

			return promiseAgnostic.matchesAggregate(results, _every);
		},
		describeTo: function (description) {
			description.appendList('(', ' and ', ')', matchers);
		},
		describeMismatch: function (actual, description) {
			const results = _mapValues(matchers, (matcher) => {
				return matcher.matches(actual);
			});
			let first = true;
			return promiseAgnostic.describeMismatchAggregate(results, (result, key) => {
				if (result) {
					return;
				}

				const matcher = matchers[key];

				if (!first) {
					description.append('\n');
				}
				first = false;
				description
					.appendDescriptionOf(matcher)
					.append(': ');
				return description.indented(() => matcher.describeMismatch(actual, description));
			});
		}
	});
}

AllOf.allOf = function () {
	return new AllOf(arguments);
};

module.exports = AllOf;
