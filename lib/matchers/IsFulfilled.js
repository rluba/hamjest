'use strict';

var _ = require('lodash')
	, q = require('q')
	, IsPromise = require('./IsPromise')
	, asMatcher = require('./IsEqual').asMatcher
	, anything = require('./IsAnything').anything
	;

function IsFulfilled(valueOrMatcher) {
	var anyValue = (arguments.length === 0);
	var valueMatcher = (anyValue ? anything() : asMatcher(valueOrMatcher));
	return _.create(new IsPromise(), {
		matchesSafely: function (actual) {
			return actual.then(function (value) {
				return valueMatcher.matches(value);
			}, function () {
				return false;
			});
		},
		describeTo: function (description) {
			if (anyValue) {
				description.append('a fulfilled promise');
			}
			else {
				description.append('a promise fulfilled with ');
				valueMatcher.describeTo(description);
			}
		},
		describeMismatchSafely: function (actual, description) {
			var deferred = q.defer();

			var qPromise = q(actual);
			qPromise.fin(function () {
				if (!q.isFulfilled(qPromise)) {
					description
						.append('was not fulfilled (')
						.appendValue(qPromise.inspect())
						.append(')');
					deferred.resolve();
				}
				else {
					description
						.append('fulfillment value: ');
					deferred.resolve(valueMatcher.describeMismatch(qPromise.inspect().value, description));
				}
			});
			return deferred.promise;
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
IsFulfilled.isFulfilledWith = IsFulfilled.fulfilled;

module.exports = IsFulfilled;
