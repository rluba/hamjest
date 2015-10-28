'use strict';

var _ = require('lodash')
	, Matcher = require('./Matcher')
	, assertThat = require('../assertThat')
	, is = require('./Is').is
	, func = require('./IsFunction').func
	;
var getType = require('../utils/getType');
var getTypeName = require('../utils/getTypeName');

function IsInstanceOf(expectedType) {
	assertThat(expectedType, is(func()));

	return _.create(new Matcher(), {
		matches: function (actual) {
			return actual instanceof expectedType;
		},
		describeTo: function (description) {
			description
				.append('an instance of ')
				.append(getTypeName(expectedType));
		},
		describeMismatch: function (actual, description) {
			if(_.isUndefined(actual)) {
				description
					.append('was ')
					.appendValue(actual);
				return;
			}

			description
				.appendValue(actual)
				.append(' is a ')
				.append(getType(actual));
		}
	});
}

IsInstanceOf.instanceOf = function (operand) {
	return new IsInstanceOf(operand);
};

module.exports = IsInstanceOf;
