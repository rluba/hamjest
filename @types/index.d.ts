declare module 'hamjest' {
	type Value = any;

	export class Matcher {
		constructor(fns?: {matches?: (value: Value) => boolean; describeTo?: (description: Description) => void; describeMismatch?: (value: Value, description: Description) => void});
		matches(actual: Value): boolean;
		describeTo(description: Description): void;
		describeMismatch(value: Value, description: Description): void;
	}

	type ValueOrMatcher = Value | Matcher;

	export class TypeSafeMatcher<T> extends Matcher {
		constructor(fns?: {isExpectedType?: (value: Value) => boolean; matchesSafely?: (actual: T) => boolean; describeTo?: (description: Description) => void; describeMismatchSafely?: (value: T, description: Description) => void});
		isExpectedType(actual: Value): boolean;
		matchesSafely(actual: T): boolean;
		describeMismatchSafely(value: T, description: Description): void;
	}

	export class FeatureMatcher<T> extends Matcher {
		constructor(valueOrMatcher: ValueOrMatcher, featureDescription: string, featureName: string, featureFunction: (actual: Value) => T)
	}

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

	export function assertThat(actual: Value, matcher: ValueOrMatcher): void;
	export function assertThat(reason: string, actual: Value, matcher: ValueOrMatcher): void;

	export function promiseThat(actual: Promise<Value>, matcher: Matcher): Promise<any>;
	export function promiseThat(reason: string, actual: Promise<Value>, matcher: Matcher): Promise<any>;

	export function fail(reason?: string): void;

	// anything: require('./matchers/IsAnything').anything,;
	export function anything(): Matcher;

	// strictlyEqualTo: require('./matchers/IsSame').strictlyEqualTo,;
	export function strictlyEqualTo(expectedValue: Value): Matcher;

	// is: require('./matchers/Is').is,;
	export function is(valueOrMatcher: ValueOrMatcher): Matcher;

	// not: require('./matchers/IsNot').not,;
	export function not(valueOrMatcher: ValueOrMatcher): Matcher;

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
	export function array(): TypeSafeMatcher<Array<any>>;

	// bool: require('./matchers/IsBoolean').bool,;
	export function bool(): TypeSafeMatcher<boolean>;

	// boolean: require('./matchers/IsBoolean').bool,;
	export function boolean(): TypeSafeMatcher<boolean>;

	// date: require('./matchers/IsDate').date,;
	export function date(): TypeSafeMatcher<Date>;

	// func: require('./matchers/IsFunction').func,;
	export function func(): Matcher;

	// number: require('./matchers/IsNumber').number,;
	export function number(): TypeSafeMatcher<number>;

	// object: require('./matchers/IsObject').object,;
	export function object(): TypeSafeMatcher<object>;

	// regExp: require('./matchers/IsRegExp').regExp,;
	export function regExp(): TypeSafeMatcher<RegExp>;

	// string: require('./matchers/IsString').string,;
	export function string(): TypeSafeMatcher<string>;

	// containsString: SubstringMatcher.containsString,;
	export function containsString(subString: string): TypeSafeMatcher<string>;

	// containsStrings: SubstringMatcher.containsStrings,;
	export function containsStrings(...subStrings: string[]): TypeSafeMatcher<string>;

	// startsWith: SubstringMatcher.startsWith,;
	export function startsWith(subString: string): TypeSafeMatcher<string>;

	// endsWith: SubstringMatcher.endsWith,;
	export function endsWith(subString: string): TypeSafeMatcher<string>;

	// matchesPattern: require('./matchers/IsStringMatching').matchesPattern,;
	export function matchesPattern(stringOrPattern: string | RegExp): TypeSafeMatcher<string>;

	// matches: require('./matchers/matches'),;
	export function matches(target: Value): TypeSafeMatcher<Matcher>;

	// failsToMatch: require('./matchers/failsToMatch'),;
	export function failsToMatch(target: Value, descriptionMatcher?: ValueOrMatcher): TypeSafeMatcher<Matcher>;

	// hasDescription: require('./matchers/hasDescription'),;
	export function hasDescription(matcher: ValueOrMatcher): TypeSafeMatcher<Matcher>;

	// lessThan: NumberComparisonMatcher.lessThan,;
	export function lessThan(number: number): TypeSafeMatcher<number>;

	// lessThanOrEqualTo: NumberComparisonMatcher.lessThanOrEqualTo,;
	export function lessThanOrEqualTo(number: number): TypeSafeMatcher<number>;

	// greaterThan: NumberComparisonMatcher.greaterThan,;
	export function greaterThan(number: number): TypeSafeMatcher<number>;

	// greaterThanOrEqualTo: NumberComparisonMatcher.greaterThanOrEqualTo,;
	export function greaterThanOrEqualTo(number: number): TypeSafeMatcher<number>;

	// closeTo: require('./matchers/IsCloseTo').closeTo,;
	export function closeTo(number: number, delta: number): TypeSafeMatcher<number>;

	// inRange: require('./matchers/inRange'),;
	export function inRange(upperBound: number): TypeSafeMatcher<number>;
	export function inRange(lowerBound: number, upperBound: number): TypeSafeMatcher<number>;

	// after: DateComparisonMatcher.after,;
	export function after(date: Date): TypeSafeMatcher<Date>;

	// afterOrEqualTo: DateComparisonMatcher.afterOrEqualTo,;
	export function afterOrEqualTo(date: Date): TypeSafeMatcher<Date>;

	// before: DateComparisonMatcher.before,;
	export function before(date: Date): TypeSafeMatcher<Date>;

	// beforeOrEqualTo: DateComparisonMatcher.beforeOrEqualTo,;
	export function beforeOrEqualTo(date: Date): TypeSafeMatcher<Date>;

	// allOf: require('./matchers/AllOf').allOf,;
	export function allOf(...matchers: Matcher[]): Matcher;

	// anyOf: require('./matchers/AnyOf').anyOf,;
	export function anyOf(...matchers: Matcher[]): Matcher;

	// everyItem: require('./matchers/Every').everyItem,;
	export function everyItem(valueOrMatcher: ValueOrMatcher): Matcher;

	// hasItem: require('./matchers/IsArrayWithItem').hasItem,;
	export function hasItem(valueOrMatcher: ValueOrMatcher): TypeSafeMatcher<Array<any>>;

	// hasItems: require('./matchers/IsArrayWithItems').hasItems,;
	export function hasItems(...valueOrMatcher: ValueOrMatcher[]): TypeSafeMatcher<Array<any>>;

	// hasExactlyOneItem: require('./matchers/hasExactlyOneItem'),;
	export function hasExactlyOneItem(valueOrMatcher: ValueOrMatcher): TypeSafeMatcher<Array<any>>;

	// contains: require('./matchers/IsArrayContaining').contains,;
	export function contains(...valueOrMatcher: ValueOrMatcher[]): TypeSafeMatcher<Array<any>>;

	// containsInAnyOrder: require('./matchers/IsArrayContainingInAnyOrder').containsInAnyOrder,;
	export function containsInAnyOrder(...valueOrMatcher: ValueOrMatcher[]): TypeSafeMatcher<Array<any>>;

	// orderedBy: require('./matchers/IsArrayOrderedBy').orderedBy,;
	export function orderedBy(comparisonFunction: (a: Value, b: Value) => boolean, orderName?: string): TypeSafeMatcher<Array<any>>;

	// hasSize: require('./matchers/hasSize'),;
	export function hasSize(size: ValueOrMatcher): Matcher;

	// isEmpty: require('./matchers/isEmpty'),;
	export function isEmpty(): Matcher;

	// empty: require('./matchers/isEmpty'),;
	export function empty(): Matcher;

	type PropertiesMatcher = TypeSafeMatcher<object> & {verbose: () => PropertiesMatcher};

	// hasProperties: require('./matchers/IsObjectWithProperties').hasProperties,;
	export function hasProperties(matcher: { [key: string]: ValueOrMatcher }): PropertiesMatcher;
	export function hasDeepProperties(matcher: { [key: string]: ValueOrMatcher }): PropertiesMatcher;

	// hasProperty: require('./matchers/IsObjectWithProperties').hasProperty,;
	export function hasProperty(path: string, valueOrMatcher?: ValueOrMatcher): PropertiesMatcher;

	// throws: require('./matchers/IsFunctionThrowing').throws,;
	export function throws(valueOrMatcher?: ValueOrMatcher): Matcher;

	// returns: require('./matchers/returns'),;
	export function returns(valueOrMatcher?: ValueOrMatcher): Matcher;

	// typedError: require('./matchers/typedError'),;
	export function typedError(type: Value, messageValueOrMatcher: ValueOrMatcher): Matcher;

	// promise: require('./matchers/IsPromise').promise,;
	export function promise(): TypeSafeMatcher<Promise<any>>;

	// fulfilled: require('./matchers/IsFulfilled').fulfilled,;
	export function fulfilled(valueOrMatcher?: ValueOrMatcher): TypeSafeMatcher<Promise<any>>;

	// isFulfilledWith: require('./matchers/IsFulfilled').isFulfilledWith,;
	export function isFulfilledWith(valueOrMatcher?: ValueOrMatcher): TypeSafeMatcher<Promise<any>>;

	// willBe: require('./matchers/IsFulfilled').isFulfilledWith,;
	export function willBe(valueOrMatcher: ValueOrMatcher): TypeSafeMatcher<Promise<any>>;

	// rejected: require('./matchers/IsRejected').rejected,;
	export function rejected(valueOrMatcher?: ValueOrMatcher): TypeSafeMatcher<Promise<any>>;

	// isRejectedWith: require('./matchers/IsRejected').isRejectedWith,;
	export function isRejectedWith(valueOrMatcher?: ValueOrMatcher): TypeSafeMatcher<Promise<any>>;

	// isMatcher: Matcher.isMatcher,;
	export function isMatcher(valueOrMatcher: ValueOrMatcher): boolean;

	// asMatcher: require('./utils/asMatcher'),;
	export function asMatcher(valueOrMatcher: ValueOrMatcher): Matcher;

	type ComposingMatcher = (valueOrMatcher: ValueOrMatcher) => Matcher;

	// acceptingMatcher: require('./utils/acceptingMatcher'),;
	export function acceptingMatcher<Rtn>(fn: (matcher: Matcher) => Matcher): ComposingMatcher;

	export function describe(matcher: Matcher): Description;
}
