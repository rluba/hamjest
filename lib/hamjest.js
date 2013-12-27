'use strict';

var IsEqual = require('./matchers/IsEqual')
	, SubstringMatcher = require('./matchers/SubstringMatcher')
	;

var hamjest = {
	assertThat: require('./assertThat'),
	isMatcher: require('./matchers/Matcher').isMatcher,
	strictlyEqualTo: require('./matchers/IsSame').strictlyEqualTo,
	equalTo: IsEqual.equalTo,
	asMatcher: IsEqual.asMatcher,
	acceptingMatcher: IsEqual.acceptingMatcher,
	containsString: SubstringMatcher.containsString,
	startsWith: SubstringMatcher.startsWith,
	endsWith: SubstringMatcher.endsWith,
	allOf: require('./matchers/AllOf').allOf,
	anyOf: require('./matchers/AnyOf').anyOf,
	fulfilled: require('./matchers/IsFulfilled').fulfilled
};

module.exports = hamjest;
