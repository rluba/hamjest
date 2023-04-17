'use strict';

const _create = require('lodash/create');
const Matcher = require('./Matcher');

function IsSame(expectedValue) {
	return _create(new Matcher(), {
		matches: function (actualValue) {
			return expectedValue === actualValue;
		},
		describeTo: function (description) {
			description.append('same instance (').appendValue(expectedValue).append(')');
		}
	});
}

IsSame.strictlyEqualTo = function (operand) {
	return new IsSame(operand);
};

module.exports = IsSame;
