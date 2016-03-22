'use strict';

const asMatcher = require('./asMatcher');

module.exports = function (innerFunction) {
	return function (valueOrMatcher) {
		return innerFunction.call(this, asMatcher(valueOrMatcher));
	};
};
