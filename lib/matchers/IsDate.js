'use strict';

const _create = require('lodash/create');
const _isDate = require('lodash/isDate');
const TypeSafeMatcher = require('./TypeSafeMatcher');

function IsDate() {
	return _create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _isDate(actual);
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
