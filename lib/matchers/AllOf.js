'use strict';

const _ = require('lodash');
const Matcher = require('./Matcher');
const promiseAgnostic = require('./promiseAgnostic');

function AllOf(matchers) {
	return _.create(new Matcher(), {
		matches: function (actual) {
			const results = _.map(matchers, (matcher) => {
				return matcher.matches(actual);
			});

			return promiseAgnostic.matchesAggregate(results, _.every);
		},
		describeTo: function (description) {
			description.appendList('(', ' and ', ')', matchers);
		},
		describeMismatch: function (actual, description) {
			const results = _.mapValues(matchers, (matcher) => {
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
