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

var IsInstanceOf = function (expectedType) {
	Matcher.call(this, {
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
};
IsInstanceOf.prototype = _.create(Matcher.prototype, { 'constructor': IsInstanceOf });

var instanceOf = function (operand) {
	return new IsInstanceOf(operand);
};

module.exports = {
	IsInstanceOf: IsInstanceOf,
	instanceOf: instanceOf
};
