declare module "hamjest" {
	type Value = any;

	export class Matcher {
		matches(actual?: Value): void | boolean;
		describeTo(description?: Description): void;
		describeMismatch(value: Value, description: Description): void;
	}


	export class TypeSafeMatcher extends Matcher	{
		describeMismatch (actual: Value, description: Description): void;
		isExpectedType (): void;
		matchesSafely (): boolean;
		describeMismatchSafely (): void;
	}

	export class FeatureMatcher extends Matcher {}

	export class Description {
		useJsonForObjects: boolean;
		indentation: number;
		append(text: string): Description;
		indented(describingfn: () => Description): Description | Promise<void>;
		appendDescriptionOf(selfDescribing: Matcher): Description;
		appendValue(value: Value): Description;
		appendNonJson(value: Value): void;
		appendList(start: string, separator: string, end: string, list: Value): Description;
		get(): string;
	}

	type ValueOrMatcher = Value | Matcher;

	export function assertThat(actual: Value, matcher: Matcher): void;
	export function assertThat(reason: string, actual: Value, matcher: Matcher): void;

	export function promiseThat(actual: Value, matcher: Matcher): void;
	export function promiseThat(reason: string, actual: Value, matcher: Matcher): void;

	export function fail(): void;
	export function fail(reason: string): void;

	// anything: require('./matchers/IsAnything').anything,;
	export function anything(): Matcher;

	// strictlyEqualTo: require('./matchers/IsSame').strictlyEqualTo,;
	export function equalTo(expectedValue: Value): Matcher;

	// is: require('./matchers/Is').is,;
	export function is(matcher: Matcher): Matcher;

	// not: require('./matchers/IsNot').not,;
	export function not(matcher: Matcher): Matcher;

	// equalTo: IsEqual.equalTo,;
	export function equalTo(expectedValue: Value): Matcher;

	// truthy: require('./matchers/truthy'),;
	export function truthy(): Matcher;

	// falsy: require('./matchers/falsy'),;
	export function falsy(): Matcher;

	// falsey: require('./matchers/falsy'),;
	export function falsey(): Matcher;

	// defined: require('./matchers/IsDefined').defined,;
	export function defined(): Matcher;

	// undefined: require('./matchers/IsDefined').undefined,;
	export function undefined(): Matcher;

	// undef: require('./matchers/IsDefined').undefined,;
	export function undef(): Matcher;

	// instanceOf: require('./matchers/IsInstanceOf').instanceOf,;
	export function instanceOf(expectedType: Value): Matcher;

	// array: require('./matchers/IsArray').array,;
	export function array(): Matcher;

	// bool: require('./matchers/IsBoolean').bool,;
	export function bool(): Matcher;

	// boolean: require('./matchers/IsBoolean').bool,;
	export function boolean(): Matcher;

	// date: require('./matchers/IsDate').date,;
	export function date(): Matcher;

	// func: require('./matchers/IsFunction').func,;
	export function func(): Matcher;

	// number: require('./matchers/IsNumber').number,;
	export function number(): Matcher;

	// object: require('./matchers/IsObject').object,;
	export function object(): Matcher;

	// regExp: require('./matchers/IsRegExp').regExp,;
	export function regExp(): Matcher;

	// string: require('./matchers/IsString').string,;
	export function string(): Matcher;

	// containsString: SubstringMatcher.containsString,;
	export function containsString(subString: string): Matcher;

	// containsStrings: SubstringMatcher.containsStrings,;
	export function containsStrings(...subStrings: string[]): Matcher;

	// startsWith: SubstringMatcher.startsWith,;
	export function startsWith(subString: string): Matcher;

	// endsWith: SubstringMatcher.endsWith,;
	export function endWith(subString: string): Matcher;

	// matchesPattern: require('./matchers/IsStringMatching').matchesPattern,;
	export function matchesPattern(stringOrPattern: string | RegExp): Matcher;

	// matches: require('./matchers/matches'),;
	export function matches(...matcher: ValueOrMatcher[]): Matcher;

	// failsToMatch: require('./matchers/failsToMatch'),;
	export function failsToMatch(...matcher: ValueOrMatcher[]): Matcher;

	// hasDescription: require('./matchers/hasDescription'),;
	export function hasDescription(matcher: ValueOrMatcher): Matcher;

	// lessThan: NumberComparisonMatcher.lessThan,;
	export function lessThan(number: number): Matcher;

	// lessThanOrEqualTo: NumberComparisonMatcher.lessThanOrEqualTo,;
	export function lessThanOrEqualTo(number: number): Matcher;

	// greaterThan: NumberComparisonMatcher.greaterThan,;
	export function greaterThan(number: number): Matcher;

	// greaterThanOrEqualTo: NumberComparisonMatcher.greaterThanOrEqualTo,;
	export function greaterThanOrEqualTo(number: number): Matcher;

	// closeTo: require('./matchers/IsCloseTo').closeTo,;
	export function closeTo(number: number, delta: number): Matcher;

	// inRange: require('./matchers/inRange'),;
	export function inRange(upperBound: number): Matcher;
	export function inRange(lowerBound: number, upperBound: number): Matcher;

	// after: DateComparisonMatcher.after,;
	export function after(date: Date): Matcher;

	// afterOrEqualTo: DateComparisonMatcher.afterOrEqualTo,;
	export function afterOrEqualTo(date: Date): Matcher;

	// before: DateComparisonMatcher.before,;
	export function before(date: Date): Matcher;

	// beforeOrEqualTo: DateComparisonMatcher.beforeOrEqualTo,;
	export function beforeOrEqualTo(date: Date): Matcher;

	// allOf: require('./matchers/AllOf').allOf,;
	export function allOf(...matchers: Matcher[]): Matcher;

	// anyOf: require('./matchers/AnyOf').anyOf,;
	export function anyOf(...matchers: Matcher[]): Matcher;

	// everyItem: require('./matchers/Every').everyItem,;
	export function everyItem(valueOrMatcher: ValueOrMatcher): Matcher;

	// hasItem: require('./matchers/IsArrayWithItem').hasItem,;
	export function hasItem(valueOrMatcher: ValueOrMatcher): Matcher;

	// hasItems: require('./matchers/IsArrayWithItems').hasItems,;
	export function hasItems(...valueOrMatcher: ValueOrMatcher[]): Matcher;

	// hasExactlyOneItem: require('./matchers/hasExactlyOneItem'),;
	export function hasExactlyOneItem(): Matcher;

	// contains: require('./matchers/IsArrayContaining').contains,;
	export function contains(...valueOrMatcher: ValueOrMatcher[]): Matcher;

	// containsInAnyOrder: require('./matchers/IsArrayContainingInAnyOrder').containsInAnyOrder,;
	export function containsInAnyOrder(...valueOrMatcher: ValueOrMatcher[]): Matcher;

	// orderedBy: require('./matchers/IsArrayOrderedBy').orderedBy,;
	export function orderedBy(comparisonFunction: (a: Value, b: Value) => boolean): Matcher;
	export function orderedBy(comparisonFunction: (a: Value, b: Value) => boolean, orderName: string): Matcher;

	// hasSize: require('./matchers/hasSize'),;
	export function hasSize(size: number): Matcher;

	// isEmpty: require('./matchers/isEmpty'),;
	export function isEmpty(): Matcher;

	// empty: require('./matchers/isEmpty'),;
	export function empty(): Matcher;

	// hasProperties: require('./matchers/IsObjectWithProperties').hasProperties,;
	export function hasProperties(matcher: { [key: string]: ValueOrMatcher }): Matcher;

	// hasProperty: require('./matchers/IsObjectWithProperties').hasProperty,;
	export function hasProperty(path: string, valueOrMatcher?: ValueOrMatcher): Matcher;

	// throws: require('./matchers/IsFunctionThrowing').throws,;
	export function throws(): Matcher;
	export function throws(matcher: Matcher): Matcher;

	// returns: require('./matchers/returns'),;
	export function returns(): Matcher;
	export function returns(matcher: ValueOrMatcher): Matcher;

	// typedError: require('./matchers/typedError'),;
	export function typedError(type: Value, messageValueOrMatcher: ValueOrMatcher): Matcher;

	// promise: require('./matchers/IsPromise').promise,;
	export function promise(): Matcher;

	// fulfilled: require('./matchers/IsFulfilled').fulfilled,;
	export function fulfilled(): Matcher;
	export function fulfilled(valueOrMatcher: ValueOrMatcher): Matcher;

	// isFulfilledWith: require('./matchers/IsFulfilled').isFulfilledWith,;
	export function isFulfilledWith(): Matcher;
	export function isFulfilledWith(valueOrMatcher: ValueOrMatcher): Matcher;

	// willBe: require('./matchers/IsFulfilled').isFulfilledWith,;
	export function willBe(valueOrMatcher: ValueOrMatcher): Matcher;

	// rejected: require('./matchers/IsRejected').rejected,;
	export function rejected(): Matcher;
	export function rejected(valueOrMatcher: ValueOrMatcher): Matcher;

	// isRejectedWith: require('./matchers/IsRejected').isRejectedWith,;
	export function isRejectedWith(): Matcher;
	export function isRejectedWith(valueOrMatcher: ValueOrMatcher): Matcher;

	// promiseAllOf: require('./matchers/AllOf').allOf;
	export function promiseAllOf(...matchers: Matcher[]): Matcher;

	// isMatcher: Matcher.isMatcher,;
	export function isMatcher(valueOrMatcher: ValueOrMatcher): void;

	// asMatcher: require('./utils/asMatcher'),;
	export function asMatcher(valueOrMatcher: ValueOrMatcher): void;

	// acceptingMatcher: require('./utils/acceptingMatcher'),;
	export function acceptingMatcher<Rtn>(fn: (matcher: Matcher) => Rtn): Rtn;

	export function describe(matcher: Matcher): Description;
}
