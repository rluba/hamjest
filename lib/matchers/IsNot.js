'use strict';

var _ = require('lodash')
	, Matcher = require('./Matcher')
	, acceptingMatcher = require('./IsEqual').acceptingMatcher
	;
var promiseAgnostic = require('./promiseAgnostic');

var IsNot = acceptingMatcher(function IsNot(innerMatcher) {
	return _.create(new Matcher(), {
		matches: function (actual) {
			return promiseAgnostic.matches(innerMatcher.matches(actual), function (result) {
				return !result;
			});
		},
		describeTo: function (description) {
			description
				.append('not ')
				.appendDescriptionOf(innerMatcher);
		},
		describeMismatch: function (value, description) {
			description
				.append('was ')
				.appendValue(value);
		}
	});
});

IsNot.not = function (innerMatcher) {
	return new IsNot(innerMatcher);
};

module.exports = IsNot;
