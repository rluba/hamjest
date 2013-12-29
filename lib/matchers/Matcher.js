'use strict';

var _ = require('lodash-node')
	;

var Matcher = function (params) {
	params = params || {};
	_.extend(this, params);
};

_.extend(Matcher.prototype, {
	matches: function () {
		throw new Error('Not implemented');
	},
	describeTo: function () {
		throw new Error('Not implemented');
	},
	describeMismatch: function (value, description) {
		description.append('was ').appendValue(value);
	}
});

_.extend(Matcher, {
	isMatcher: function (matcherOrValue) {
		return !_.isUndefined(matcherOrValue) &&
			_.isFunction(matcherOrValue.matches) &&
			_.isFunction(matcherOrValue.describeTo) &&
			_.isFunction(matcherOrValue.describeMismatch);
	}
});

module.exports = Matcher;
