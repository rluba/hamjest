'use strict';

const Bluebird = require('bluebird');

function deferMatcher(matcher) {
	return {
		matches: function (actual) {
			return Bluebird.try(() => matcher.matches(actual));
		},
		describeTo: function (description) {
			description.append('deferred: ');
			matcher.describeTo(description);
		},
		describeMismatch: function (actual, description) {
			description.append('deferred: ');
			return Bluebird.try(() => matcher.describeMismatch(actual, description));
		}
	};
}

module.exports = deferMatcher;
