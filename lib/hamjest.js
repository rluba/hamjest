'use strict';

var IsEqual = require('./matchers/IsEqual')
	, SubstringMatcher = require('./matchers/SubstringMatcher')
	;

var hamjest = {
	assertThat: require('./assertThat'),
	isMatcher: require('./matchers/Matcher').isMatcher,
	anything: require('./matchers/IsAnything').anything,
	strictlyEqualTo: require('./matchers/IsSame').strictlyEqualTo,
	is: require('./matchers/Is').is,
	not: require('./matchers/IsNot').not,
	equalTo: IsEqual.equalTo,
	asMatcher: IsEqual.asMatcher,
	acceptingMatcher: IsEqual.acceptingMatcher,
	instanceOf: require('./matchers/IsInstanceOf').instanceOf,
	array: require('./matchers/IsArray').array,
	bool: require('./matchers/IsBoolean').bool,
	date: require('./matchers/IsDate').date,
	func: require('./matchers/IsFunction').func,
	number: require('./matchers/IsNumber').number,
	object: require('./matchers/IsObject').object,
	regExp: require('./matchers/IsRegExp').regExp,
	string: require('./matchers/IsString').string,
	containsString: SubstringMatcher.containsString,
	startsWith: SubstringMatcher.startsWith,
	endsWith: SubstringMatcher.endsWith,
	allOf: require('./matchers/AllOf').allOf,
	anyOf: require('./matchers/AnyOf').anyOf,
	throws: require('./matchers/IsFunctionThrowing').throws,
	promiseThat: require('./promiseThat'),
	promise: require('./matchers/IsPromise').promise,
	fulfilled: require('./matchers/IsFulfilled').fulfilled,
	rejected: require('./matchers/IsRejected').rejected
};

module.exports = hamjest;
