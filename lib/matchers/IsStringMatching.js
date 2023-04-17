'use strict';

const _create = require('lodash/create');
const IsString = require('./IsString');
const assertThat = require('../assertThat');
const anyOf = require('./AnyOf').anyOf;
const string = require('./IsString').string;
const regExp = require('./IsRegExp').regExp;

function IsStringMatching(stringOrPattern) {
	assertThat(stringOrPattern, anyOf(regExp(), string()));

	const pattern = new RegExp(stringOrPattern);

	return _create(new IsString(), {
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
