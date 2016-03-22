'use strict';

const _ = require('lodash');
const TypeSafeMatcher = require('./TypeSafeMatcher');

function IsFunction() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isFunction(actual);
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
