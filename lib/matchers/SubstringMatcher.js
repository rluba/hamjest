'use strict';

var _ = require('lodash-node')
	, Matcher = require('./Matcher')
	;

var SubstringMatcher = function (substring, relation, matchesString) {
	Matcher.call(this, {
		matches: function (actualValue) {
			return _.isString(actualValue) && matchesString.call(this, actualValue);
		},
		describeTo: function (description) {
			description
				.append('a string ')
				.append(relation)
				.append(' ')
				.appendValue(substring);
		},
		describeMismatch: function (actual, description) {
			if (_.isString(actual)) {
				description
					.append('was ')
					.appendValue(actual);
			}
			else {
				description
					.append('was a ')
					.append(typeof actual)
					.append(' (')
					.appendValue(actual)
					.append(')');
			}
		}
	});
};
SubstringMatcher.prototype = _.create(Matcher.prototype, { 'constructor': SubstringMatcher });

var containsString = function (substring) {
	return new SubstringMatcher(substring, 'containing', function (actualString) {
		return actualString.indexOf(substring) !== -1;
	});
};

var startsWith = function (prefix) {
	return new SubstringMatcher(prefix, 'starting with', function (actualString) {
		return actualString.indexOf(prefix) === 0;
	});
};

var endsWith = function (suffix) {
	return new SubstringMatcher(suffix, 'ending with', function (actualString) {
		return actualString.indexOf(suffix, actualString.length - suffix.length) !== -1;
	});
};

module.exports = {
	SubstringMatcher: SubstringMatcher,
	containsString: containsString,
	startsWith: startsWith,
	endsWith: endsWith
};
