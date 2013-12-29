'use strict';

var _ = require('lodash-node')
	, Matcher = require('./Matcher')
	;

function getName(type) {
	if (!type.name) {
		return 'ANONYMOUS FUNCTION';
	}

	return type.name;
}

function IsInstanceOf(expectedType) {
	return _.create(new Matcher(), {
		matches: function (actual) {
			return actual instanceof expectedType;
		},
		describeTo: function (description) {
			description
				.append('an instance of ')
				.append(getName(expectedType));
		},
		describeMismatch: function (actual, description) {
			description
				.appendValue(actual)
				.append(' is a ')
				.append(getName(actual.constructor));
		}
	});
}

IsInstanceOf.instanceOf = function (operand) {
	return new IsInstanceOf(operand);
};

module.exports = IsInstanceOf;
