'use strict';

const _ = require('lodash');
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
			} else {
				description.append('a promise rejected with ');
				valueMatcher.describeTo(description);
			}
		},
		describeMismatchSafely: function (actual, description) {
			return actual.then(
				(actualValue) => {
					description
						.append('was fulfilled with ')
						.appendValue(actualValue);
				},
				(error) => {
					description
						.append('rejection value ');
					return valueMatcher.describeMismatch(error, description);
				}
			);
		}
	});
}

IsRejected.rejected = function (operand) {
	if (arguments.length === 0) {
		return new IsRejected();
	} else {
		return new IsRejected(operand);
	}
};
IsRejected.isRejectedWith = IsRejected.rejected;

module.exports = IsRejected;
