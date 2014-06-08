'use strict';

var _ = require('lodash')
	, IsString = require('./IsString')
	, assertThat = require('../assertThat')
	, anyOf = require('./AnyOf').anyOf
	, string = require('./IsString').string
	, regExp = require('./IsRegExp').regExp
	;

function IsStringMatching(stringOrPattern) {
	assertThat(stringOrPattern, anyOf(regExp(), string()));

	var pattern = new RegExp(stringOrPattern);

	return _.create(new IsString(), {
		matchesSafely: function (actual) {
			return pattern.test(actual);
		},
		describeTo: function (description) {
			description
				.append('a string matching ')
				.appendValue(pattern);
		},
		describeMismatchSafely: function (actual, description) {
			description
				.append('was ')
				.appendValue(actual);
		}
	});
}

IsStringMatching.matchesPattern = function (stringOrPattern) {
	return new IsStringMatching(stringOrPattern);
};

module.exports = IsStringMatching;
