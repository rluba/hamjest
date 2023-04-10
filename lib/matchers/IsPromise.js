'use strict';

const _create = require('lodash/create');
const _isFunction = require('lodash/isFunction');
const TypeSafeMatcher = require('./TypeSafeMatcher');

function IsPromise() {
	return _create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return actual && _isFunction(actual.then);
		},
		describeTo: function (description) {
			description
				.append('a promise');
		}
	});
}

IsPromise.promise = function () {
	return new IsPromise();
};

module.exports = IsPromise;
