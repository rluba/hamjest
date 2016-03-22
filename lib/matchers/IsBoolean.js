'use strict';

const _ = require('lodash');
const TypeSafeMatcher = require('./TypeSafeMatcher');

function IsBoolean() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isBoolean(actual);
		},
		describeTo: function (description) {
			description
				.append('a boolean');
		}
	});
}

IsBoolean.bool = function () {
	return new IsBoolean();
};

module.exports = IsBoolean;
