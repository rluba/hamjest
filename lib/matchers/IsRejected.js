'use strict';

var _ = require('lodash-node')
	, q = require('q')
	, Matcher = require('./Matcher')
	, asMatcher = require('./IsEqual').asMatcher
	, anything = require('./ISAnything').anything
	;

var IsRejected = function (valueOrMatcher) {
	var anyValue = (arguments.length === 0);
	var valueMatcher = (anyValue ? anything() : asMatcher(valueOrMatcher));
	Matcher.call(this, {
		matches: function (actual) {
			if (!q.isPromise(actual)) {
				return false;
			}

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
		describeMismatch: function (actual, description) {
			if(!q.isPromise(actual)) {
				description
					.append('was not a promise (')
					.appendValue(actual)
					.append(')');
			}
			else if (!q.isRejected(actual)) {
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
};
IsRejected.prototype = _.create(Matcher.prototype, { 'constructor': IsRejected });

module.exports = {
	IsRejected: IsRejected,
	rejected: function (operand) {
		if(arguments.length === 0) {
			return new IsRejected();
		}
		else {
			return new IsRejected(operand);
		}
	}
};
