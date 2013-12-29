'use strict';

var _ = require('lodash-node')
	, TypeSafeMatcher = require('./TypeSafeMatcher')
	;

function IsFunction() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isFunction(actual);
		},
		matchesSafely: function () {
			return true;
		},
		describeTo: function (description) {
			description
				.append('a function');
		}
	});
}

IsFunction.func = function () {
	return new IsFunction();
};

module.exports = IsFunction;
