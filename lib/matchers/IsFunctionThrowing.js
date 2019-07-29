'use strict';

const _ = require('lodash');
const IsFunction = require('./IsFunction');
const asMatcher = require('../utils/asMatcher');
const anything = require('./IsAnything').anything;

function IsFunctionThrowing(valueOrMatcher) {
	const anyValue = (arguments.length === 0);
	const exceptionMatcher = (anyValue ? anything() : asMatcher(valueOrMatcher));
	return _.create(new IsFunction(), {
		matchesSafely: function (throwingFunction) {
			try {
				throwingFunction();
				return false;
			} catch (e) {
				return exceptionMatcher.matches(e);
			}
		},
		describeTo: function (description) {
			description.append('a function throwing ');
			exceptionMatcher.describeTo(description);
		},
		describeMismatch: function (throwingFunction, description) {
			try {
				throwingFunction();
				description
					.appendValue(throwingFunction)
					.append(' did not throw anything');
			} catch (e) {
				description.append('thrown object: ');
				return exceptionMatcher.describeMismatch(e, description);
			}
		}
	});
}

IsFunctionThrowing.throws = function (operand) {
	if (arguments.length === 0) {
		return new IsFunctionThrowing();
	} else {
		return new IsFunctionThrowing(operand);
	}
};

module.exports = IsFunctionThrowing;
