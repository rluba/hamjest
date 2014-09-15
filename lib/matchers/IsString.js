'use strict';

var _ = require('lodash')
	, TypeSafeMatcher = require('./TypeSafeMatcher')
	;

function IsString() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isString(actual);
		},
		describeTo: function (description) {
			description
				.append('a string');
		}
	});
}

IsString.string = function () {
	return new IsString();
};

module.exports = IsString;
