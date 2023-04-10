'use strict';

const _create = require('lodash/create');
const _isBoolean = require('lodash/isBoolean');
const TypeSafeMatcher = require('./TypeSafeMatcher');

function IsBoolean() {
	return _create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _isBoolean(actual);
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
