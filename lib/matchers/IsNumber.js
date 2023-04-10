'use strict';

const _create = require('lodash/create');
const _isNumber = require('lodash/isNumber');
const TypeSafeMatcher = require('./TypeSafeMatcher');

function IsNumber() {
	return _create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _isNumber(actual);
		},
		describeTo: function (description) {
			description
				.append('a number');
		}
	});
}

IsNumber.number = function () {
	return new IsNumber();
};

module.exports = IsNumber;
