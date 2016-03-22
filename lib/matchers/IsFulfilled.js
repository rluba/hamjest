'use strict';

const _ = require('lodash');
const q = require('q');
const IsPromise = require('./IsPromise');
const asMatcher = require('../utils/asMatcher');
const anything = require('./IsAnything').anything;

function IsFulfilled(valueOrMatcher) {
	const anyValue = (arguments.length === 0);
	const valueMatcher = (anyValue ? anything() : asMatcher(valueOrMatcher));
	return _.create(new IsPromise(), {
		matchesSafely: function (actual) {
			return actual.then((value) => {
				return valueMatcher.matches(value);
			}, () => false);
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
			const deferred = q.defer();

			const qPromise = q(actual);
			qPromise.fin(() => {
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
