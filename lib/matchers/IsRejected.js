'use strict';

var _ = require('lodash-node')
	, q = require('q')
	, IsPromise = require('./IsPromise')
	, asMatcher = require('./IsEqual').asMatcher
	, anything = require('./IsAnything').anything
	;

function IsRejected(valueOrMatcher) {
	var anyValue = (arguments.length === 0);
	var valueMatcher = (anyValue ? anything() : asMatcher(valueOrMatcher));
	return _.create(new IsPromise(), {
		matchesSafely: function (actual) {
			if (!q.isRejected(actual)) {
				return false;
			}

			return valueMatcher.matches(actual.inspect().reason);
		},
		describeTo: function (description) {
			description.append('rejected promise');
			if (!anyValue) {
				description.append(' (');
				valueMatcher.describeTo(description);
				description.append(')');
			}
		},
		describeMismatchSafely: function (actual, description) {
			if (!q.isRejected(actual)) {
				description
					.append('was not rejected (')
					.appendValue(actual.inspect())
					.append(')');
			}
			else {
				description
					.append('was rejected with ')
					.appendValue(actual.inspect().reason);
			}
		}
	});
}

IsRejected.rejected = function (operand) {
	if (arguments.length === 0) {
		return new IsRejected();
	}
	else {
		return new IsRejected(operand);
	}
};

module.exports = IsRejected;
