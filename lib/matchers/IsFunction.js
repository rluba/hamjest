'use strict';

const _create = require('lodash/create');
const _isFunction = require('lodash/isFunction');
const TypeSafeMatcher = require('./TypeSafeMatcher');

function IsFunction() {
	return _create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _isFunction(actual);
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
