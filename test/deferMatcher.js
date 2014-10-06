'use strict';

var q = require('q');

function deferMatcher (matcher) {
	return {
		matches: function (actual) {
			return q().then(function () {
				return matcher.matches(actual);
			});
		},
		describeTo: function (description) {
			description.append('deferred: ');
			matcher.describeTo(description);
		},
		describeMismatch: function (actual, description) {
			description.append('deferred: ');
			return q().then(function () {
				return matcher.describeMismatch(actual, description);
			});
		}
	};
}

module.exports = deferMatcher;
