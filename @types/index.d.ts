declare module "hamjest" {
  type TODO = any
  type Matcher = TODO;
  type Value = any

  export function assertThat(actual: Value, matcher: Matcher): void
  export function assertThat(reason: string, actual: Value, matcher: Matcher): void


  // anything: require('./matchers/IsAnything').anything,
  export function anything(): void

  // strictlyEqualTo: require('./matchers/IsSame').strictlyEqualTo,
  export function equalTo(expectedValue: Value): void

  // is: require('./matchers/Is').is,
  export function is(matcher: Matcher): void

  // not: require('./matchers/IsNot').not,
  export function not(matcher: Matcher): void

  // equalTo: IsEqual.equalTo,
  export function equalTo(expectedValue: Value): void

  // truthy: require('./matchers/truthy'),
  export function truthy(): void

  // falsy: require('./matchers/falsy'),
  export function falsy(): void

  // falsey: require('./matchers/falsy'),
  export function falsey(): void

	// defined: require('./matchers/IsDefined').defined,
	// undefined: require('./matchers/IsDefined').undefined,
	// undef: require('./matchers/IsDefined').undefined,
	// instanceOf: require('./matchers/IsInstanceOf').instanceOf,
  // array: require('./matchers/IsArray').array,
  export function array(): void

	// bool: require('./matchers/IsBoolean').bool,
	// boolean: require('./matchers/IsBoolean').bool,
	// date: require('./matchers/IsDate').date,
	// func: require('./matchers/IsFunction').func,
	// number: require('./matchers/IsNumber').number,
	// object: require('./matchers/IsObject').object,
	// regExp: require('./matchers/IsRegExp').regExp,
	// string: require('./matchers/IsString').string,
	// containsString: SubstringMatcher.containsString,
	// containsStrings: SubstringMatcher.containsStrings,
	// startsWith: SubstringMatcher.startsWith,
	// endsWith: SubstringMatcher.endsWith,
	// matchesPattern: require('./matchers/IsStringMatching').matchesPattern,
	// matches: require('./matchers/matches'),
	// failsToMatch: require('./matchers/failsToMatch'),
	// hasDescription: require('./matchers/hasDescription'),
	// lessThan: NumberComparisonMatcher.lessThan,
	// lessThanOrEqualTo: NumberComparisonMatcher.lessThanOrEqualTo,
	// greaterThan: NumberComparisonMatcher.greaterThan,
	// greaterThanOrEqualTo: NumberComparisonMatcher.greaterThanOrEqualTo,
  // inRange: require('./matchers/inRange'),
  export function inRange(upperBound: number)
  export function inRange(lowerBound: number, upperBound: number)

	// after: DateComparisonMatcher.after,
	// afterOrEqualTo: DateComparisonMatcher.afterOrEqualTo,
	// before: DateComparisonMatcher.before,
	// beforeOrEqualTo: DateComparisonMatcher.beforeOrEqualTo,
	// closeTo: require('./matchers/IsCloseTo').closeTo,
	// allOf: require('./matchers/AllOf').allOf,
	// anyOf: require('./matchers/AnyOf').anyOf,
	// everyItem: require('./matchers/Every').everyItem,
	// hasItem: require('./matchers/IsArrayWithItem').hasItem,
	// hasItems: require('./matchers/IsArrayWithItems').hasItems,
  // hasExactlyOneItem: require('./matchers/hasExactlyOneItem'),
  export function hasExactlyOneItem()

	// contains: require('./matchers/IsArrayContaining').contains,
	// containsInAnyOrder: require('./matchers/IsArrayContainingInAnyOrder').containsInAnyOrder,
	// orderedBy: require('./matchers/IsArrayOrderedBy').orderedBy,
  // hasSize: require('./matchers/hasSize'),
  export function hasSize(size: number)

  // isEmpty: require('./matchers/isEmpty'),
  export function isEmpty()

	// empty: require('./matchers/isEmpty'),
	// hasProperties: require('./matchers/IsObjectWithProperties').hasProperties,
	// hasProperty: require('./matchers/IsObjectWithProperties').hasProperty,
	// throws: require('./matchers/IsFunctionThrowing').throws,
	// returns: require('./matchers/returns'),
	// typedError: require('./matchers/typedError'),
	// promise: require('./matchers/IsPromise').promise,
	// fulfilled: require('./matchers/IsFulfilled').fulfilled,
	// isFulfilledWith: require('./matchers/IsFulfilled').isFulfilledWith,
	// willBe: require('./matchers/IsFulfilled').isFulfilledWith,
	// rejected: require('./matchers/IsRejected').rejected,
	// isRejectedWith: require('./matchers/IsRejected').isRejectedWith,
	// promiseAllOf: require('./matchers/AllOf').allOf



}