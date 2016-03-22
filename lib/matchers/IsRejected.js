'use strict';

const _ = require('lodash');
const q = require('q');
const IsPromise = require('./IsPromise');
const asMatcher = require('../utils/asMatcher');
const anything = require('./IsAnything').anything;

function IsRejected(valueOrMatcher) {
	const anyValue = (arguments.length === 0);
	const valueMatcher = (anyValue ? anything() : asMatcher(valueOrMatcher));
	return _.create(new IsPromise(), {
		matchesSafely: function (actual) {
			return actual.then(() => false, (reason) => {
				return valueMatcher.matches(reason);
			});
		},
		describeTo: function (description) {
			if (anyValue) {
				description.append('a rejected promise');
			}
			else {
				description.append('a promise rejected with ');
				valueMatcher.describeTo(description);
			}
		},
		describeMismatchSafely: function (actual, description) {
			const deferred = q.defer();

			const qPromise = q(actual);
			qPromise.fin(() => {
				if (!q.isRejected(qPromise)) {
					description
						.append('was not rejected (')
						.appendValue(qPromise.inspect())
						.append(')');
					deferred.resolve();
				}
				else {
					description
						.append('rejection value ');
					deferred.resolve(valueMatcher.describeMismatch(qPromise.inspect().reason, description));
				}
			});
			return deferred.promise;
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
IsRejected.isRejectedWith = IsRejected.rejected;

module.exports = IsRejected;
