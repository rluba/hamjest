declare module "hamjest" {
  type TODO = any
  type Value = any

  export function assertThat(actual: Value, matcher: TODO): void
  export function assertThat(reason: string, actual: Value, matcher: TODO): void

  export function equalTo(expectedValue: Value): void

}