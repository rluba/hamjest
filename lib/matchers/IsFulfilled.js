'use strict';

var _ = require('lodash-node')
	, q = require('q')
	, IsPromise = require('./IsPromise')
	, asMatcher = require('./IsEqual').asMatcher
	, anything = require('./ISAnything').anything
	;

function IsFulfilled(valueOrMatcher) {
	var anyValue = (arguments.length === 0);
	var valueMatcher = (anyValue ? anything() : asMatcher(valueOrMatcher));
	return _.create(new IsPromise(), {
		matchesSafely: function (actual) {
			if (!q.isFulfilled(actual)) {
				return false;
			}

			return valueMatcher.matches(actual.inspect().value);
		},
		describeTo: function (description) {
			description.append('fulfilled promise');
			if (!anyValue) {
				description.append(' (');
				valueMatcher.describeTo(description);
				description.append(')');
			}
		},
		describeMismatchSafely: function (actual, description) {
			if (!q.isFulfilled(actual)) {
				description
					.append('was not fulfilled (')
					.appendValue(actual.inspect())
					.append(')');
			}
			else {
				description
					.append('was fulfilled with ')
					.appendValue(actual.inspect().value);
			}
		}
	});
}

IsFulfilled.fulfilled = function (operand) {
	if (arguments.length === 0) {
		return new IsFulfilled();
	}
	else {
		return new IsFulfilled(operand);
	}
};

module.exports = IsFulfilled;
