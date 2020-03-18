declare module "hamjest" {
  type TODO = any
  type Matcher = TODO;
  type Value = any
  type ValueOrMatcher = Value | Matcher

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
  export function defined(): void

  // undefined: require('./matchers/IsDefined').undefined,
  export function undefined(): void

  // undef: require('./matchers/IsDefined').undefined,
  export function undef(): void

  // instanceOf: require('./matchers/IsInstanceOf').instanceOf,
  export function instanceOf(expectedType: Value): void

  // array: require('./matchers/IsArray').array,
  export function array(): void

  // bool: require('./matchers/IsBoolean').bool,
  export function bool(): void

  // boolean: require('./matchers/IsBoolean').bool,
  export function boolean(): void

  // date: require('./matchers/IsDate').date,
  export function date(): void

  // func: require('./matchers/IsFunction').func,
  export function func(): void

	// number: require('./matchers/IsNumber').number,
  export function number(): void

  // object: require('./matchers/IsObject').object,
  export function object(): void

  // regExp: require('./matchers/IsRegExp').regExp,
  export function regExp(): void

  // string: require('./matchers/IsString').string,
  export function string(): void

  // containsString: SubstringMatcher.containsString,
  export function containsString(subString: string): void

  // containsStrings: SubstringMatcher.containsStrings,
  export function containsStrings(...subStrings: string[]): void

  // startsWith: SubstringMatcher.startsWith,
  export function startsWith(subString: string): void

  // endsWith: SubstringMatcher.endsWith,
  export function endWith(subString: string): void

  // matchesPattern: require('./matchers/IsStringMatching').matchesPattern,
  export function matchesPattern(stringOrPattern: string | RegExp): void

  // matches: require('./matchers/matches'),
  export function matches(...matcher: ValueOrMatcher[]): void // ????? unsure if typed correctly

  // failsToMatch: require('./matchers/failsToMatch'),
  export function failsToMatch(...matcher: ValueOrMatcher[]): void // ????? unsure if typed correctly

  // hasDescription: require('./matchers/hasDescription'),
  export function hasDescription(matcher: ValueOrMatcher): void

  // lessThan: NumberComparisonMatcher.lessThan,
  export function lessThan(number: number): void

  // lessThanOrEqualTo: NumberComparisonMatcher.lessThanOrEqualTo,
  export function lessThanOrEqualTo(number: number): void

  // greaterThan: NumberComparisonMatcher.greaterThan,
  export function greaterThan(number: number): void

  // greaterThanOrEqualTo: NumberComparisonMatcher.greaterThanOrEqualTo,
  export function greaterThanOrEqualTo(number: number): void

  // closeTo: require('./matchers/IsCloseTo').closeTo,
  export function closeTo(number: number, delta: number): void

  // inRange: require('./matchers/inRange'),
  export function inRange(upperBound: number): void
  export function inRange(lowerBound: number, upperBound: number): void

  // after: DateComparisonMatcher.after,
  export function after(date: Date): void

  // afterOrEqualTo: DateComparisonMatcher.afterOrEqualTo,
  export function afterOrEqualTo(date: Date): void

  // before: DateComparisonMatcher.before,
  export function before(date: Date): void

  // beforeOrEqualTo: DateComparisonMatcher.beforeOrEqualTo,
  export function beforeOrEqualTo(date: Date): void

  // allOf: require('./matchers/AllOf').allOf,
  export function allOf(...matchers: Matcher): void

  // anyOf: require('./matchers/AnyOf').anyOf,
  export function anyOf(...matchers: Matcher): void

  // everyItem: require('./matchers/Every').everyItem,
  export function everyItem(valueOrMatcher: ValueOrMatcher): void

  // hasItem: require('./matchers/IsArrayWithItem').hasItem,
  export function hasItem(valueOrMatcher: ValueOrMatcher): void

  // hasItems: require('./matchers/IsArrayWithItems').hasItems,
  export function hasItems(...valueOrMatcher: ValueOrMatcher[]): void

  // hasExactlyOneItem: require('./matchers/hasExactlyOneItem'),
  export function hasExactlyOneItem(): void

  // contains: require('./matchers/IsArrayContaining').contains,
  export function contains(...valueOrMatcher: ValueOrMatcher[]): void

  // containsInAnyOrder: require('./matchers/IsArrayContainingInAnyOrder').containsInAnyOrder,
  export function containsInAnyOrder(...valueOrMatcher: ValueOrMatcher[]): void

  // orderedBy: require('./matchers/IsArrayOrderedBy').orderedBy,
  export function orderedBy(comparisonFunction: (a: Value, b: Value) => boolean): void
  export function orderedBy(comparisonFunction: (a: Value, b: Value) => boolean, orderName: string): void

  // hasSize: require('./matchers/hasSize'),
  export function hasSize(size: number): void

  // isEmpty: require('./matchers/isEmpty'),
  export function isEmpty(): void

  // empty: require('./matchers/isEmpty'),
  export function empty(): void

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