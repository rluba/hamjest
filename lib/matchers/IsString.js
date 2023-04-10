'use strict';

const _create = require('lodash/create');
const _isString = require('lodash/isString');
const TypeSafeMatcher = require('./TypeSafeMatcher');

function IsString() {
	return _create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _isString(actual);
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
