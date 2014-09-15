'use strict';

var _ = require('lodash')
	, TypeSafeMatcher = require('./TypeSafeMatcher')
	;

function IsDate() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isDate(actual);
		},
		describeTo: function (description) {
			description
				.append('a date');
		}
	});
}

IsDate.date = function () {
	return new IsDate();
};

module.exports = IsDate;
