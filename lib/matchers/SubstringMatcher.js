'use strict';

var _ = require('lodash-node')
	, TypeSafeMatcher = require('./TypeSafeMatcher')
	;

function SubstringMatcher(substring, relation, matchesString) {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isString(actual);
		},
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
		}
	});
}

_.extend(SubstringMatcher, {
	containsString: function (substring) {
		return new SubstringMatcher(substring, 'containing', function (actualString) {
			return actualString.indexOf(substring) !== -1;
		});
	},
	startsWith: function (prefix) {
		return new SubstringMatcher(prefix, 'starting with', function (actualString) {
			return actualString.indexOf(prefix) === 0;
		});
	},
	endsWith: function (suffix) {
		return new SubstringMatcher(suffix, 'ending with', function (actualString) {
			return actualString.indexOf(suffix, actualString.length - suffix.length) !== -1;
		});
	}
});

module.exports = SubstringMatcher;
