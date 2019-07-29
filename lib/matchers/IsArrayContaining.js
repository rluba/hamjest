'use strict';

const _ = require('lodash');
const IsArray = require('./IsArray');
const asMatcher = require('../utils/asMatcher');
const promiseAgnostic = require('./promiseAgnostic');

function IsArrayContaining(itemsOrMatchers) {
	const matchers = _.map(itemsOrMatchers, asMatcher);
	return _.create(new IsArray(), {
		matchesSafely: function (actual) {
			if (actual.length !== matchers.length) {
				return false;
			}

			const results = _.map(matchers, (matcher, index) => {
				return matcher.matches(actual[index]);
			});

			return promiseAgnostic.matchesAggregate(results, _.every);
		},
		describeTo: function (description) {
			description.appendList('[', ', ', ']', matchers);
		},
		describeMismatchSafely: function (actual, description) {
			const results = _.map(actual, (value, index) => {
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
