'use strict';

var _ = require('lodash-node')
	, Matcher = require('./Matcher')
	;

var IsSame = function (expectedValue) {
	Matcher.call(this, {
		matches: function (actualValue) {
			return expectedValue === actualValue;
		},
		describeTo: function (description) {
			description.append('same instance (').appendValue(expectedValue).append(')');
		}
	});
};
IsSame.prototype = _.create(Matcher.prototype, { 'constructor': IsSame });

var strictlyEqualTo = function (operand) {
	return new IsSame(operand);
};


module.exports = {
	IsSame: IsSame,
	strictlyEqualTo: strictlyEqualTo
};
