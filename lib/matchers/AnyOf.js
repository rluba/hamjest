'use strict';

var _ = require('lodash');
var Matcher = require('./Matcher');

var promiseAgnostic = require('./promiseAgnostic');

function AnyOf(matchers) {
	return _.create(new Matcher(), {
		matches: function (actual) {
			var results = _.map(matchers, function (matcher) {
				return matcher.matches(actual);
			});

			return promiseAgnostic.matchesAggregate(results, _.any);
		},
		describeTo: function (description) {
			description.appendList('(', ' or ', ')', matchers);
		}
	});
}

AnyOf.anyOf = function () {
	return new AnyOf(arguments);
};

module.exports = AnyOf;
