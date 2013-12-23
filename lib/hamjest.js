'use strict';

var hamjest = {
	isMatcher: require('./matchers/Matcher').isMatcher,
	equalTo: require('./matchers/IsEqual').equalTo
};

module.exports = hamjest;
