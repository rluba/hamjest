'use strict';

var _ = require('lodash-node')
	, TypeSafeMatcher = require('./TypeSafeMatcher')
	;

function IsNumber() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isNumber(actual);
		},
		matchesSafely: function () {
			return true;
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
