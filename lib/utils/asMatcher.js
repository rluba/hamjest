'use strict';

var isMatcher = require('../matchers/Matcher').isMatcher;
var equalTo = require('../matchers/IsEqual').equalTo;

module.exports = function (valueOrMatcher) {
	if (isMatcher(valueOrMatcher)) {
		return valueOrMatcher;
	}
	else {
		return equalTo(valueOrMatcher);
	}
};
