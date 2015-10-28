'use strict';

var _ = require('lodash')
	, IsEqual = require('./matchers/IsEqual')
	, Matcher = require('./matchers/Matcher')
	, SubstringMatcher = require('./matchers/SubstringMatcher')
	, NumberComparisonMatcher = require('./matchers/NumberComparisonMatcher')
	, DateComparisonMatcher = require('./matchers/DateComparisonMatcher')
	, Description = require('./Description')
	;

require('./fixErrorJson')();

var asserts = {
	assertThat: require('./assertThat'),
	promiseThat: require('./promiseThat'),
	fail: require('./fail')
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
	truthy: require('./matchers/truthy'),
	falsy: require('./matchers/falsy'),
	falsey: require('./matchers/falsy'),
	defined: require('./matchers/IsDefined').defined,
	undefined: require('./matchers/IsDefined').undefined,
	undef: require('./matchers/IsDefined').undefined,
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
	matches: require('./matchers/matches'),
	failsToMatch: require('./matchers/failsToMatch'),
	hasDescription: require('./matchers/hasDescription'),
	lessThan: NumberComparisonMatcher.lessThan,
	lessThanOrEqualTo: NumberComparisonMatcher.lessThanOrEqualTo,
	greaterThan: NumberComparisonMatcher.greaterThan,
	greaterThanOrEqualTo: NumberComparisonMatcher.greaterThanOrEqualTo,
	after: DateComparisonMatcher.after,
	afterOrEqualTo: DateComparisonMatcher.afterOrEqualTo,
	before: DateComparisonMatcher.before,
	beforeOrEqualTo: DateComparisonMatcher.beforeOrEqualTo,
	closeTo: require('./matchers/IsCloseTo').closeTo,
	allOf: require('./matchers/AllOf').allOf,
	anyOf: require('./matchers/AnyOf').anyOf,
	everyItem: require('./matchers/Every').everyItem,
	hasItem: require('./matchers/IsArrayWithItem').hasItem,
	hasItems: require('./matchers/IsArrayWithItems').hasItems,
	contains: require('./matchers/IsArrayContaining').contains,
	containsInAnyOrder: require('./matchers/IsArrayContainingInAnyOrder').containsInAnyOrder,
	orderedBy: require('./matchers/IsArrayOrderedBy').orderedBy,
	hasSize: require('./matchers/hasSize'),
	isEmpty: require('./matchers/isEmpty'),
	hasProperties: require('./matchers/IsObjectWithProperties').hasProperties,
	hasProperty: require('./matchers/IsObjectWithProperties').hasProperty,
	throws: require('./matchers/IsFunctionThrowing').throws,
	returns: require('./matchers/returns'),
	typedError: require('./matchers/typedError'),
	promise: require('./matchers/IsPromise').promise,
	fulfilled: require('./matchers/IsFulfilled').fulfilled,
	isFulfilledWith: require('./matchers/IsFulfilled').isFulfilledWith,
	willBe: require('./matchers/IsFulfilled').isFulfilledWith,
	rejected: require('./matchers/IsRejected').rejected,
	isRejectedWith: require('./matchers/IsRejected').isRejectedWith,
	promiseAllOf: require('./matchers/AllOf').allOf
};

var utils = {
	isMatcher: Matcher.isMatcher,
	asMatcher: IsEqual.asMatcher,
	acceptingMatcher: IsEqual.acceptingMatcher,
	Description: Description,
	describe: function (matcher) {
		return new Description()
			.appendDescriptionOf(matcher)
			.get();
	}
};

var hamjest = {};
_.extend(hamjest, asserts, matchers, utils);

module.exports = hamjest;
