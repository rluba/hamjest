'use strict';

var _ = require('lodash-node')
	, Matcher = require('./Matcher')
	;

function AnyOf(matchers) {
	return _.create(new Matcher(), {
		matches: function (actual) {
			var matched = false;
			_.forEach(matchers, function (matcher) {
				if (matcher.matches(actual)) {
					matched = true;
					return false;
				}
			});
			return matched;
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
