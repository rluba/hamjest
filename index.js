'use strict';

const IsEqual = require('./lib/matchers/IsEqual');
const Matcher = require('./lib/matchers/Matcher');
const SubstringMatcher = require('./lib/matchers/SubstringMatcher');
const NumberComparisonMatcher = require('./lib/matchers/NumberComparisonMatcher');
const DateComparisonMatcher = require('./lib/matchers/DateComparisonMatcher');
const Description = require('./lib/Description');

require('./lib/fixErrorJson')();

// asserts
module.exports.assertThat = require('./lib/assertThat');
module.exports.promiseThat = require('./lib/promiseThat');
module.exports.fail = require('./lib/fail');

// matchers
module.exports.Matcher = Matcher;
module.exports.TypeSafeMatcher = require('./lib/matchers/TypeSafeMatcher');
module.exports.FeatureMatcher = require('./lib/matchers/FeatureMatcher');

module.exports.anything = require('./lib/matchers/IsAnything').anything;
module.exports.strictlyEqualTo = require('./lib/matchers/IsSame').strictlyEqualTo;
module.exports.is = require('./lib/matchers/Is').is;
module.exports.not = require('./lib/matchers/IsNot').not;
module.exports.equalTo = IsEqual.equalTo;
module.exports.truthy = require('./lib/matchers/truthy');
module.exports.falsy = require('./lib/matchers/falsy');
module.exports.falsey = require('./lib/matchers/falsy');
module.exports.defined = require('./lib/matchers/IsDefined').defined;
module.exports.undefined = require('./lib/matchers/IsDefined').undefined;
module.exports.undef = require('./lib/matchers/IsDefined').undefined;
module.exports.instanceOf = require('./lib/matchers/IsInstanceOf').instanceOf;
module.exports.array = require('./lib/matchers/IsArray').array;
module.exports.bool = require('./lib/matchers/IsBoolean').bool;
module.exports.boolean = require('./lib/matchers/IsBoolean').bool;
module.exports.date = require('./lib/matchers/IsDate').date;
module.exports.func = require('./lib/matchers/IsFunction').func;
module.exports.number = require('./lib/matchers/IsNumber').number;
module.exports.object = require('./lib/matchers/IsObject').object;
module.exports.regExp = require('./lib/matchers/IsRegExp').regExp;
module.exports.string = require('./lib/matchers/IsString').string;
module.exports.containsString = SubstringMatcher.containsString;
module.exports.containsStrings = SubstringMatcher.containsStrings;
module.exports.startsWith = SubstringMatcher.startsWith;
module.exports.endsWith = SubstringMatcher.endsWith;
module.exports.matchesPattern = require('./lib/matchers/IsStringMatching').matchesPattern;
module.exports.matches = require('./lib/matchers/matches');
module.exports.failsToMatch = require('./lib/matchers/failsToMatch');
module.exports.hasDescription = require('./lib/matchers/hasDescription');
module.exports.lessThan = NumberComparisonMatcher.lessThan;
module.exports.lessThanOrEqualTo = NumberComparisonMatcher.lessThanOrEqualTo;
module.exports.greaterThan = NumberComparisonMatcher.greaterThan;
module.exports.greaterThanOrEqualTo = NumberComparisonMatcher.greaterThanOrEqualTo;
module.exports.inRange = require('./lib/matchers/inRange');
module.exports.after = DateComparisonMatcher.after;
module.exports.afterOrEqualTo = DateComparisonMatcher.afterOrEqualTo;
module.exports.before = DateComparisonMatcher.before;
module.exports.beforeOrEqualTo = DateComparisonMatcher.beforeOrEqualTo;
module.exports.closeTo = require('./lib/matchers/IsCloseTo').closeTo;
module.exports.allOf = require('./lib/matchers/AllOf').allOf;
module.exports.anyOf = require('./lib/matchers/AnyOf').anyOf;
module.exports.everyItem = require('./lib/matchers/Every').everyItem;
module.exports.hasItem = require('./lib/matchers/IsArrayWithItem').hasItem;
module.exports.hasItems = require('./lib/matchers/IsArrayWithItems').hasItems;
module.exports.hasExactlyOneItem = require('./lib/matchers/hasExactlyOneItem');
module.exports.contains = require('./lib/matchers/IsArrayContaining').contains;
module.exports.containsInAnyOrder = require('./lib/matchers/IsArrayContainingInAnyOrder').containsInAnyOrder;
module.exports.orderedBy = require('./lib/matchers/IsArrayOrderedBy').orderedBy;
module.exports.hasSize = require('./lib/matchers/hasSize');
module.exports.isEmpty = require('./lib/matchers/isEmpty');
module.exports.empty = require('./lib/matchers/isEmpty');
module.exports.hasProperties = require('./lib/matchers/IsObjectWithProperties').hasProperties;
module.exports.hasDeepProperties = require('./lib/matchers/IsObjectWithProperties').hasDeepProperties;
module.exports.hasProperty = require('./lib/matchers/IsObjectWithProperties').hasProperty;
module.exports.throws = require('./lib/matchers/IsFunctionThrowing').throws;
module.exports.returns = require('./lib/matchers/returns');
module.exports.typedError = require('./lib/matchers/typedError');
module.exports.promise = require('./lib/matchers/IsPromise').promise;
module.exports.fulfilled = require('./lib/matchers/IsFulfilled').fulfilled;
module.exports.isFulfilledWith = require('./lib/matchers/IsFulfilled').isFulfilledWith;
module.exports.willBe = require('./lib/matchers/IsFulfilled').isFulfilledWith;
module.exports.rejected = require('./lib/matchers/IsRejected').rejected;
module.exports.isRejectedWith = require('./lib/matchers/IsRejected').isRejectedWith;
// Deprecated
module.exports.promiseAllOf = require('./lib/matchers/AllOf').allOf;

// utils
module.exports.isMatcher = Matcher.isMatcher;
module.exports.asMatcher = require('./lib/utils/asMatcher');
module.exports.acceptingMatcher = require('./lib/utils/acceptingMatcher');
module.exports.Description = Description;
module.exports.describe = function (matcher) {
	return new Description()
		.appendDescriptionOf(matcher)
		.get();
};
