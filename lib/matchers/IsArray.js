'use strict';

const _create = require('lodash/create');
const _isArray = require('lodash/isArray');
const TypeSafeMatcher = require('./TypeSafeMatcher');

function IsArray() {
	return _create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _isArray(actual);
		},
		describeTo: function (description) {
			description
				.append('an array');
		}
	});
}

IsArray.array = function () {
	return new IsArray();
};

module.exports = IsArray;
