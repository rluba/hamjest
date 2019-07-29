'use strict';

const _ = require('lodash');
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
			} else {
				description.append('a promise fulfilled with ');
				valueMatcher.describeTo(description);
			}
		},
		describeMismatchSafely: function (actual, description) {
			return actual.then(
				(actualValue) => {
					description
						.append('fulfillment value: ');
					return valueMatcher.describeMismatch(actualValue, description);
				},
				(error) => {
					description
						.append('was rejected with ')
						.appendValue(error);
				}
			);
		}
	});
}

IsFulfilled.fulfilled = function (operand) {
	if (arguments.length === 0) {
		return new IsFulfilled();
	} else {
		return new IsFulfilled(operand);
	}
};
IsFulfilled.isFulfilledWith = IsFulfilled.fulfilled;

module.exports = IsFulfilled;
