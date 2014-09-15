'use strict';

var _ = require('lodash')
	, Matcher = require('./Matcher')
	;

function AllOf(matchers) {
	return _.create(new Matcher(), {
		matches: function (actual) {
			var matched = true;
			_.forEach(matchers, function (matcher) {
				if(!matcher.matches(actual)) {
					matched = false;
					return false;
				}
			});
			return matched;
		},
		describeTo: function (description) {
			description.appendList('(', ' and ', ')', matchers);
		},
		describeMismatch: function (actual, description) {
			var result;
			_.forEach(matchers, function (matcher) {
				if(!matcher.matches(actual)) {
					description
						.appendDescriptionOf(matcher)
						.append(': ');
					result = matcher.describeMismatch(actual, description);
					return false;
				}
			});
			return result;
		}
	});
}

AllOf.allOf = function () {
	return new AllOf(arguments);
};

module.exports = AllOf;
