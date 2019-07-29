'use strict';

const isMatcher = require('../matchers/Matcher').isMatcher;
const equalTo = require('../matchers/IsEqual').equalTo;

module.exports = function (valueOrMatcher) {
	if (isMatcher(valueOrMatcher)) {
		return valueOrMatcher;
	} else {
		return equalTo(valueOrMatcher);
	}
};
