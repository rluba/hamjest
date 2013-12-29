'use strict';

var _ = require('lodash-node')
	, Matcher = require('./Matcher')
	;

var IsSame = function (expectedValue) {
	return _.create(new Matcher(), {
		matches: function (actualValue) {
			return expectedValue === actualValue;
		},
		describeTo: function (description) {
			description.append('same instance (').appendValue(expectedValue).append(')');
		}
	});
};

var strictlyEqualTo = function (operand) {
	return new IsSame(operand);
};


module.exports = {
	IsSame: IsSame,
	strictlyEqualTo: strictlyEqualTo
};
