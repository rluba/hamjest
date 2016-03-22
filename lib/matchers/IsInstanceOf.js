'use strict';

const _ = require('lodash');
const Matcher = require('./Matcher');
const assertThat = require('../assertThat');
const is = require('./Is').is;
const func = require('./IsFunction').func;
const getType = require('../utils/getType');
const getTypeName = require('../utils/getTypeName');

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
			if (_.isUndefined(actual)) {
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
