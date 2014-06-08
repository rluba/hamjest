'use strict';

var _ = require('lodash-node')
	, IsEqual = require('./matchers/IsEqual')
	, Matcher = require('./matchers/Matcher')
	, SubstringMatcher = require('./matchers/SubstringMatcher')
	, NumberComparisonMatcher = require('./matchers/NumberComparisonMatcher')
	;

var asserts = {
	assertThat: require('./assertThat'),
	promiseThat: require('./promiseThat')
};

var matchers = {
	Matcher: Matcher,
	TypeSafeMatcher: require('./matchers/TypeSafeMatcher'),
	FeatureMatcher: require('./matchers/FeatureMatcher'),

	anything: require('./matchers/IsAnything').anything,
	strictlyEqualTo: require('./matchers/IsSame').strictlyEqualTo,
	is: require('./matchers/Is').is,
	not: require('./matchers/IsNot').not,
	equalTo: IsEqual.equalTo,
	defined: require('./matchers/IsDefined').defined,
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
	matchesPattern: require('./matchers/IsStringMatching').matchesPattern,
	lessThan: NumberComparisonMatcher.lessThan,
	lessThanOrEqualTo: NumberComparisonMatcher.lessThanOrEqualTo,
	greaterThan: NumberComparisonMatcher.greaterThan,
	greaterThanOrEqualTo: NumberComparisonMatcher.greaterThanOrEqualTo,
	closeTo: require('./matchers/IsCloseTo').closeTo,
	allOf: require('./matchers/AllOf').allOf,
	anyOf: require('./matchers/AnyOf').anyOf,
	hasItem: require('./matchers/IsArrayWithItem').hasItem,
	hasItems: require('./matchers/IsArrayWithItems').hasItems,
	contains: require('./matchers/IsArrayContaining').contains,
	containsInAnyOrder: require('./matchers/IsArrayContainingInAnyOrder').containsInAnyOrder,
	orderedBy: require('./matchers/IsArrayOrderedBy').orderedBy,
	hasSize: require('./matchers/IsCollectionWithSize').hasSize,
	hasProperties: require('./matchers/IsObjectWithProperties').hasProperties,
	hasProperty: require('./matchers/IsObjectWithProperties').hasProperty,
	throws: require('./matchers/IsFunctionThrowing').throws,
	promise: require('./matchers/IsPromise').promise,
	fulfilled: require('./matchers/IsFulfilled').fulfilled,
	rejected: require('./matchers/IsRejected').rejected
};

var utils = {
	isMatcher: Matcher.isMatcher,
	asMatcher: IsEqual.asMatcher,
	acceptingMatcher: IsEqual.acceptingMatcher
};

var hamjest = {};
_.extend(hamjest, asserts, matchers, utils);

module.exports = hamjest;
