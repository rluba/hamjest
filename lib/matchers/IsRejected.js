'use strict';

var _ = require('lodash')
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
			return actual.then(function () {
				return false;
			}, function (reason) {
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
			var deferred = q.defer();

			var qPromise = q(actual);
			qPromise.fin(function () {
				if (!q.isRejected(qPromise)) {
					description
						.append('was not rejected (')
						.appendValue(qPromise.inspect())
						.append(')');
				}
				else {
					description
						.append('was rejected with ')
						.appendValue(qPromise.inspect().reason);
				}
				deferred.resolve();
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
