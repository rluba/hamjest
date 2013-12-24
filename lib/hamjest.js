'use strict';

var IsEqual = require('./matchers/IsEqual')
	, SubstringMatcher = require('./matchers/SubstringMatcher')
	;

var hamjest = {
	assertThat: require('./assertThat'),
	isMatcher: require('./matchers/Matcher').isMatcher,
	sameAs: require('./matchers/IsSame').sameAs,
	equalTo: IsEqual.equalTo,
	asMatcher: IsEqual.asMatcher,
	acceptingMatcher: IsEqual.acceptingMatcher,
	containsString: SubstringMatcher.containsString,
	startsWith: SubstringMatcher.startsWith,
	endsWith: SubstringMatcher.endsWith
};

module.exports = hamjest;
