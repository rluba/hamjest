'use strict';

const _ = require('lodash');
const TypeSafeMatcher = require('./TypeSafeMatcher');

function IsPromise() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return actual && _.isFunction(actual.then);
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
