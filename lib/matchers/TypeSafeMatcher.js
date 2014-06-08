'use strict';

var _ = require('lodash')
	, Matcher = require('./Matcher')
	;

function TypeSafeMatcher() {
	return _.create(new Matcher(), {
		matches: function (actual) {
			return this.isExpectedType(actual) && this.matchesSafely(actual);
		},
		describeMismatch: function (actual, description) {
			if (!this.isExpectedType(actual)) {
				if(_.isUndefined(actual)) {
					description.append('was undefined');
					return;
				}

				description
					.append('was a ')
					.append(typeof actual)
					.append(' (')
					.appendValue(actual)
					.append(')');
			}
			else {
				this.describeMismatchSafely(actual, description);
			}
		},
		isExpectedType: function () {
			throw new Error('Not implemented');
		},
		matchesSafely: function () {
			throw new Error('Not implemented');
		},
		describeMismatchSafely: function () {
			throw new Error('Not implemented');
		}
	});
}

module.exports = TypeSafeMatcher;
