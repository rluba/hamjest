'use strict';

var _ = require('lodash-node')
	, Matcher = require('../lib/matcher')
	;

var IsEqual = function (expectedValue) {
	Matcher.call(this, {
		matches: function (actualValue) {
			return _.isEqual(expectedValue, actualValue);
		},
		describeTo: function (description) {
			description.appendValue(expectedValue);
		}
	});
};
IsEqual.prototype = _.create(Matcher.prototype, { 'constructor': IsEqual });

module.exports = {
	IsEqual: IsEqual,
	equalTo: function (operand) {
		return new IsEqual(operand);
	}
};
