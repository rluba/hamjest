'use strict';

var _ = require('lodash')
	, TypeSafeMatcher = require('./TypeSafeMatcher')
	;

function IsNumber() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isNumber(actual);
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
