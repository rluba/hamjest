'use strict';

var _ = require('lodash-node')
	, Matcher = require('./Matcher')
	;

var AllOf = function (matchers) {
	Matcher.call(this, {
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
			_.forEach(matchers, function (matcher) {
				if(!matcher.matches(actual)) {
					description
						.appendDescriptionOf(matcher)
						.append(' ');
					matcher.describeMismatch(actual, description);
					return false;
				}
			});
		}
	});
};
AllOf.prototype = _.create(Matcher.prototype, { 'constructor': AllOf });

var allOf = function () {
	return new AllOf(arguments);
};

module.exports = {
	AllOf: AllOf,
	allOf: allOf
};
