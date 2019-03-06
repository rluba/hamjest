'use strict';

const _ = require('lodash');

function Matcher() {
	return _.create({}, {
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
}

Matcher.isMatcher = function (valueOrMatcher) {
	return !_.isUndefined(valueOrMatcher) &&
		!_.isNull(valueOrMatcher) &&
		_.isFunction(valueOrMatcher.matches) &&
		_.isFunction(valueOrMatcher.describeTo) &&
		_.isFunction(valueOrMatcher.describeMismatch);
};

module.exports = Matcher;
