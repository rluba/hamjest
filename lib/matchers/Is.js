'use strict';

var _ = require('lodash-node')
	, Matcher = require('./Matcher')
	, acceptingMatcher = require('./IsEqual').acceptingMatcher
	;

var Is = acceptingMatcher(function (innerMatcher) {
	return _.create(new Matcher(), {
		matches: function (actualValue) {
			return innerMatcher.matches(actualValue);
		},
		describeTo: function (description) {
			description
				.append('is ')
				.appendDescriptionOf(innerMatcher);
		},
		describeMismatch: function (value, description) {
			innerMatcher.describeMismatch(value, description);
		}
	});
});

var is = function (innerMatcher) {
	return new Is(innerMatcher);
};

module.exports = {
	Is: Is,
	is: is
};
