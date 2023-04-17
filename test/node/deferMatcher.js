'use strict';

function deferMatcher(matcher) {
	return {
		matches: function (actual) {
			return Promise.resolve().then(() => matcher.matches(actual));
		},
		describeTo: function (description) {
			description.append('deferred: ');
			matcher.describeTo(description);
		},
		describeMismatch: function (actual, description) {
			description.append('deferred: ');
			return Promise.resolve().then(() => matcher.describeMismatch(actual, description));
		}
	};
}

module.exports = deferMatcher;
