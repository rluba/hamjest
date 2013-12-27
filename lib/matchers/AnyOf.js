'use strict';

var _ = require('lodash-node')
	, Matcher = require('./Matcher')
	;

var AnyOf = function (matchers) {
	Matcher.call(this, {
		matches: function (actual) {
			var matched = false;
			_.forEach(matchers, function (matcher) {
				if(matcher.matches(actual)) {
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
};
AnyOf.prototype = _.create(Matcher.prototype, { 'constructor': AnyOf });

var anyOf = function () {
	return new AnyOf(arguments);
};

module.exports = {
	AnyOf: AnyOf,
	anyOf: anyOf
};
