declare module "hamjest" {
  type TODO = any
  type Matcher = TODO;
  type Value = any

  export function assertThat(actual: Value, matcher: Matcher): void
  export function assertThat(reason: string, actual: Value, matcher: Matcher): void



  // AllOf.js
  // AnyOf.js
  // DateComparisonMatcher.js
  // Every.js
  // FeatureMatcher.js
  // Is.js
  export function is(matcher: Matcher): void

  // IsAnything.js
  export function anything(): void

  // IsArray.js
  // IsArrayContaining.js
  // IsArrayContainingInAnyOrder.js
  // IsArrayOrderedBy.js
  // IsArrayWithItem.js
  // IsArrayWithItems.js
  // IsBoolean.js
  // IsCloseTo.js
  // IsDate.js
  // IsDefined.js
  // IsEqual.js
  export function equalTo(expectedValue: Value): void

  // IsFulfilled.js
  // IsFunction.js
  // IsFunctionThrowing.js
  // IsInstanceOf.js
  // IsNot.js
  export function not(matcher: Matcher): void

  // IsNumber.js
  // IsObject.js
  // IsObjectWithProperties.js
  // IsPromise.js
  // IsRegExp.js
  // IsRejected.js
  // IsSame.js
  // IsString.js
  // IsStringMatching.js
  // Matcher.js
  // NumberComparisonMatcher.js
  // SubstringMatcher.js
  // TypeSafeMatcher.js
  // failsToMatch.js
  // falsy.js
  export function falsy(): void

  // hasDescription.js
  // hasExactlyOneItem.js
  // hasSize.js
  export function hasSize(size: number)

  // inRange.js
  // isEmpty.js
  // matches.js
  // promiseAgnostic.js
  // returns.js
  // truthy.js
  export function truthy(): void

  // typedError.js

}