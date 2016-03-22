'use strict';

const _ = require('lodash');
const IsString = require('./IsString');
const assertThat = require('../assertThat');
const is = require('./Is').is;
const string = require('./IsString').string;

function SubstringMatcher(substring, relation, matchesString) {
	assertThat(substring, is(string()));

	return _.create(new IsString(), {
		matchesSafely: function (actual) {
			return matchesString.call(this, actual);
		},
		describeTo: function (description) {
			description
				.append('a string ')
				.append(relation)
				.append(' ')
				.appendValue(substring);
		},
		describeMismatchSafely: function (actual, description) {
			description
				.append('was ')
				.appendValue(actual);
		},
		getExpectedForDiff: function () { return substring; },
		formatActualForDiff: function (actual) { return actual; }
	});
}

_.extend(SubstringMatcher, {
	containsString: function (substring) {
		return new SubstringMatcher(substring, 'containing', (actualString) => {
			return actualString.indexOf(substring) !== -1;
		});
	},
	startsWith: function (prefix) {
		return new SubstringMatcher(prefix, 'starting with', (actualString) => {
			return actualString.indexOf(prefix) === 0;
		});
	},
	endsWith: function (suffix) {
		return new SubstringMatcher(suffix, 'ending with', (actualString) => {
			return actualString.indexOf(suffix, actualString.length - suffix.length) !== -1;
		});
	}
});

module.exports = SubstringMatcher;
