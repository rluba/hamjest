'use strict';

var IsEqual = require('./matchers/IsEqual')
	;

var hamjest = {
	assertThat: require('./assertThat'),
	isMatcher: require('./matchers/Matcher').isMatcher,
	equalTo: IsEqual.equalTo,
	asMatcher: IsEqual.asMatcher,
	acceptingMatcher: IsEqual.acceptingMatcher
};

module.exports = hamjest;
