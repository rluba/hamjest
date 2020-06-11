'use strict';

const _ = require('lodash');
const IsEqual = require('./matchers/IsEqual');
const Matcher = require('./matchers/Matcher');
const SubstringMatcher = require('./matchers/SubstringMatcher');
const NumberComparisonMatcher = require('./matchers/NumberComparisonMatcher');
const DateComparisonMatcher = require('./matchers/DateComparisonMatcher');
const Description = require('./Description');

require('./fixErrorJson')();

const asserts = {
	assertThat: require('./assertThat'),
	promiseThat: require('./promiseThat'),
	fail: require('./fail')
};

const matchers = {
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
	boolean: require('./matchers/IsBoolean').bool,
	date: require('./matchers/IsDate').date,
	func: require('./matchers/IsFunction').func,
	number: require('./matchers/IsNumber').number,
	object: require('./matchers/IsObject').object,
	regExp: require('./matchers/IsRegExp').regExp,
	string: require('./matchers/IsString').string,
	containsString: SubstringMatcher.containsString,
	containsStrings: SubstringMatcher.containsStrings,
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
	inRange: require('./matchers/inRange'),
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
	hasExactlyOneItem: require('./matchers/hasExactlyOneItem'),
	contains: require('./matchers/IsArrayContaining').contains,
	containsInAnyOrder: require('./matchers/IsArrayContainingInAnyOrder').containsInAnyOrder,
	orderedBy: require('./matchers/IsArrayOrderedBy').orderedBy,
	hasSize: require('./matchers/hasSize'),
	isEmpty: require('./matchers/isEmpty'),
	empty: require('./matchers/isEmpty'),
	hasProperties: require('./matchers/IsObjectWithProperties').hasProperties,
	hasDeepProperties: require('./matchers/IsObjectWithProperties').hasDeepProperties,
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
	// Deprecated
	promiseAllOf: require('./matchers/AllOf').allOf
};

const utils = {
	isMatcher: Matcher.isMatcher,
	asMatcher: require('./utils/asMatcher'),
	acceptingMatcher: require('./utils/acceptingMatcher'),
	Description: Description,
	describe: function (matcher) {
		return new Description()
			.appendDescriptionOf(matcher)
			.get();
	}
};

const hamjest = {};
_.extend(hamjest, asserts, matchers, utils);

module.exports = hamjest;
