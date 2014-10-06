'use strict';

var _ = require('lodash');
var Matcher = require('./Matcher');
var promiseAgnostic = require('./promiseAgnostic');

function AllOf(matchers) {
	return _.create(new Matcher(), {
		matches: function (actual) {
			var results = _.map(matchers, function (matcher) {
				return matcher.matches(actual);
			});

			return promiseAgnostic.matchesAggregate(results, _.all);
		},
		describeTo: function (description) {
			description.appendList('(', ' and ', ')', matchers);
		},
		describeMismatch: function (actual, description) {
			var results = _.mapValues(matchers, function (matcher) {
				return matcher.matches(actual);
			});
			var first = true;
			return promiseAgnostic.describeMismatchAggregate(results, function (result, key) {
				if (result) {
					return;
				}

				var matcher = matchers[key];

				if (!first) {
					description.append('\n');
				}
				first = false;
				description
					.appendDescriptionOf(matcher)
					.append(': ');
				return matcher.describeMismatch(actual, description);
			});
		}
	});
}

AllOf.allOf = function () {
	return new AllOf(arguments);
};

module.exports = AllOf;
