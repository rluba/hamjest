'use strict';

const _ = require('lodash');
const TypeSafeMatcher = require('./TypeSafeMatcher');

function IsArray() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isArray(actual);
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
