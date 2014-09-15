'use strict';

var _ = require('lodash')
	, q = require('q')
	, TypeSafeMatcher = require('./TypeSafeMatcher')
	;

function IsPromise() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return q.isPromiseAlike(actual);
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
