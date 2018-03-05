'use strict';

const _ = require('lodash');
const IsString = require('./IsString');
const assertThat = require('../assertThat');
const is = require('./Is').is;
const string = require('./IsString').string;

function SubstringMatcher(substring, relation, matchesString) {
	assertThat(substring, is(string()));

	return _.create(new IsString(), {
		matchesSafely(actual) {
			return matchesString.call(this, actual);
		},
		describeTo(description) {
			description
				.append('a string ')
				.append(relation)
				.append(' ')
				.appendValue(substring);
		},
		describeMismatchSafely(actual, description) {
			description
				.append('was ')
				.appendValue(actual);
		},
		getExpectedForDiff() { return substring; },
		formatActualForDiff(actual) { return actual; }
	});
}

_.extend(SubstringMatcher, {
	containsString(substring) {
		return new SubstringMatcher(substring, 'containing', (actualString) => {
			return actualString.indexOf(substring) !== -1;
		});
	},
	containsStrings(...substrings) {
		substrings.map((s) => assertThat(s, is(string())));
		return _.create(new IsString(), {
			matchesSafely(actual) {
				return _.every(substrings, (s) => actual.indexOf(s) !== -1);
			},
			describeTo(description) {
				description
					.append('a string containing ')
					.appendList('', ', ', '', substrings);
			},
			describeMismatchSafely(actual, description) {
				const notFound = _.filter(substrings, (s) => actual.indexOf(s) === -1);
				description
					.appendList('', ', ', '', notFound)
					.append(' could not be found in ')
					.appendValue(actual);
			},
		});
	},
	startsWith(prefix) {
		return new SubstringMatcher(prefix, 'starting with', (actualString) => {
			return actualString.indexOf(prefix) === 0;
		});
	},
	endsWith(suffix) {
		return new SubstringMatcher(suffix, 'ending with', (actualString) => {
			return actualString.indexOf(suffix, actualString.length - suffix.length) !== -1;
		});
	}
});

module.exports = SubstringMatcher;
