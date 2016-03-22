'use strict';

const _ = require('lodash');
const TypeSafeMatcher = require('./TypeSafeMatcher');

function IsRegExp() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isRegExp(actual);
		},
		describeTo: function (description) {
			description
				.append('a regular expression');
		}
	});
}

IsRegExp.regExp = function () {
	return new IsRegExp();
};

module.exports = IsRegExp;
