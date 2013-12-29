'use strict';

var _ = require('lodash-node')
	, q = require('q')
	, TypeSafeMatcher = require('./TypeSafeMatcher')
	;

function IsPromise() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return q.isPromise(actual);
		},
		matchesSafely: function () {
			return true;
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
