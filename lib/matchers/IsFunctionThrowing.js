'use strict';

var _ = require('lodash-node')
	, IsFunction = require('./IsFunction')
	, instanceOf = require('./IsInstanceOf').instanceOf
	, anything = require('./ISAnything').anything
	;

function IsFunctionThrowing(type) {
	var anyType = (arguments.length === 0);
	var typeMatcher = (anyType ? anything() : instanceOf(type));
	return _.create(new IsFunction(), {
		matchesSafely: function (throwingFunction) {
			try {
				throwingFunction();
				return false;
			}
			catch(e) {
				return typeMatcher.matches(e);
			}
		},
		describeTo: function (description) {
			description.append('a function throwing ');
			typeMatcher.describeTo(description);
		},
		describeMismatch: function (throwingFunction, description) {
			try {
				throwingFunction();
				description.append('did not throw anything');
			}
			catch(e) {
				typeMatcher.describeMismatch(e, description);
			}
		}
	});
}

IsFunctionThrowing.throws = function (operand) {
	if(arguments.length === 0) {
		return new IsFunctionThrowing();
	}
	else {
		return new IsFunctionThrowing(operand);
	}
};

module.exports = IsFunctionThrowing;
