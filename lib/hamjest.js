'use strict';

const IsEqual = require('./matchers/IsEqual');
const Matcher = require('./matchers/Matcher');
const SubstringMatcher = require('./matchers/SubstringMatcher');
const NumberComparisonMatcher = require('./matchers/NumberComparisonMatcher');
const DateComparisonMatcher = require('./matchers/DateComparisonMatcher');
const Description = require('./Description');

require('./fixErrorJson')();

// asserts
module.exports.assertThat = require('./assertThat');
module.exports.promiseThat = require('./promiseThat');
module.exports.fail = require('./fail');

// matchers
module.exports.Matcher = Matcher;
module.exports.TypeSafeMatcher = require('./matchers/TypeSafeMatcher');
module.exports.FeatureMatcher = require('./matchers/FeatureMatcher');

module.exports.anything = require('./matchers/IsAnything').anything;
module.exports.strictlyEqualTo = require('./matchers/IsSame').strictlyEqualTo;
module.exports.is = require('./matchers/Is').is;
module.exports.not = require('./matchers/IsNot').not;
module.exports.equalTo = IsEqual.equalTo;
module.exports.truthy = require('./matchers/truthy');
module.exports.falsy = require('./matchers/falsy');
module.exports.falsey = require('./matchers/falsy');
module.exports.defined = require('./matchers/IsDefined').defined;
module.exports.undefined = require('./matchers/IsDefined').undefined;
module.exports.undef = require('./matchers/IsDefined').undefined;
module.exports.instanceOf = require('./matchers/IsInstanceOf').instanceOf;
module.exports.array = require('./matchers/IsArray').array;
module.exports.bool = require('./matchers/IsBoolean').bool;
module.exports.boolean = require('./matchers/IsBoolean').bool;
module.exports.date = require('./matchers/IsDate').date;
module.exports.func = require('./matchers/IsFunction').func;
module.exports.number = require('./matchers/IsNumber').number;
module.exports.object = require('./matchers/IsObject').object;
module.exports.regExp = require('./matchers/IsRegExp').regExp;
module.exports.string = require('./matchers/IsString').string;
module.exports.containsString = SubstringMatcher.containsString;
module.exports.containsStrings = SubstringMatcher.containsStrings;
module.exports.startsWith = SubstringMatcher.startsWith;
module.exports.endsWith = SubstringMatcher.endsWith;
module.exports.matchesPattern = require('./matchers/IsStringMatching').matchesPattern;
module.exports.matches = require('./matchers/matches');
module.exports.failsToMatch = require('./matchers/failsToMatch');
module.exports.hasDescription = require('./matchers/hasDescription');
module.exports.lessThan = NumberComparisonMatcher.lessThan;
module.exports.lessThanOrEqualTo = NumberComparisonMatcher.lessThanOrEqualTo;
module.exports.greaterThan = NumberComparisonMatcher.greaterThan;
module.exports.greaterThanOrEqualTo = NumberComparisonMatcher.greaterThanOrEqualTo;
module.exports.inRange = require('./matchers/inRange');
module.exports.after = DateComparisonMatcher.after;
module.exports.afterOrEqualTo = DateComparisonMatcher.afterOrEqualTo;
module.exports.before = DateComparisonMatcher.before;
module.exports.beforeOrEqualTo = DateComparisonMatcher.beforeOrEqualTo;
module.exports.closeTo = require('./matchers/IsCloseTo').closeTo;
module.exports.allOf = require('./matchers/AllOf').allOf;
module.exports.anyOf = require('./matchers/AnyOf').anyOf;
module.exports.everyItem = require('./matchers/Every').everyItem;
module.exports.hasItem = require('./matchers/IsArrayWithItem').hasItem;
module.exports.hasItems = require('./matchers/IsArrayWithItems').hasItems;
module.exports.hasExactlyOneItem = require('./matchers/hasExactlyOneItem');
module.exports.contains = require('./matchers/IsArrayContaining').contains;
module.exports.containsInAnyOrder = require('./matchers/IsArrayContainingInAnyOrder').containsInAnyOrder;
module.exports.orderedBy = require('./matchers/IsArrayOrderedBy').orderedBy;
module.exports.hasSize = require('./matchers/hasSize');
module.exports.isEmpty = require('./matchers/isEmpty');
module.exports.empty = require('./matchers/isEmpty');
module.exports.hasProperties = require('./matchers/IsObjectWithProperties').hasProperties;
module.exports.hasDeepProperties = require('./matchers/IsObjectWithProperties').hasDeepProperties;
module.exports.hasProperty = require('./matchers/IsObjectWithProperties').hasProperty;
module.exports.throws = require('./matchers/IsFunctionThrowing').throws;
module.exports.returns = require('./matchers/returns');
module.exports.typedError = require('./matchers/typedError');
module.exports.promise = require('./matchers/IsPromise').promise;
module.exports.fulfilled = require('./matchers/IsFulfilled').fulfilled;
module.exports.isFulfilledWith = require('./matchers/IsFulfilled').isFulfilledWith;
module.exports.willBe = require('./matchers/IsFulfilled').isFulfilledWith;
module.exports.rejected = require('./matchers/IsRejected').rejected;
module.exports.isRejectedWith = require('./matchers/IsRejected').isRejectedWith;
// Deprecated
module.exports.promiseAllOf = require('./matchers/AllOf').allOf;

// utils
module.exports.isMatcher = Matcher.isMatcher;
module.exports.asMatcher = require('./utils/asMatcher');
module.exports.acceptingMatcher = require('./utils/acceptingMatcher');
module.exports.Description = Description;
module.exports.describe = function (matcher) {
	return new Description()
		.appendDescriptionOf(matcher)
		.get();
};
