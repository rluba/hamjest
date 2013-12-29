'use strict';

var _ = require('lodash-node')
	, TypeSafeMatcher = require('./TypeSafeMatcher')
	;

function IsArray() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isArray(actual);
		},
		matchesSafely: function () {
			return true;
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
