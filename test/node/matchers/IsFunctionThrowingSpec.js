'use strict';

const assert = require('assert');
const AssertionError = require('assertion-error');

const __ = require('../../..');

describe('IsFunctionThrowing', () => {

	describe('throws', () => {
		function throwingErrorFunction() {
			throw new Error('an error');
		}
		function notThrowingFunction() {
		}

		describe('without argument', () => {
			let sut;
			beforeEach(() => {
				sut = __.throws();
			});

			it('should not match if argument is not a function', () => {
				assert.equal(sut.matches('a string value'), false);
			});

			it('should match if function throws', () => {
				assert.ok(sut.matches(throwingErrorFunction));
			});

			it('should not match if function does not throw', () => {
				assert.equal(sut.matches(notThrowingFunction), false);
			});

			describe('description', () => {
				let description;

				beforeEach(() => {
					description = new __.Description();
				});

				it('should be nice', () => {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('a function throwing anything'));
				});

				it('should say if nothing was thrown', () => {

					sut.describeMismatch(notThrowingFunction, description);

					__.assertThat(description.get(), __.equalTo('Function notThrowingFunction did not throw anything'));
				});
			});
		});

		describe('with a value', () => {
			function throwing(value) {
				return () => {
					throw value;
				};
			}

			let sut;
			beforeEach(() => {
				sut = __.throws('a string value');
			});

			it('should not match if argument is not a function', () => {
				assert.equal(sut.matches('a string value'), false);
			});

			it('should match if function throws expected value', () => {
				assert.ok(sut.matches(throwing('a string value')));
			});

			it('should not match if function throws something different', () => {
				assert.equal(sut.matches(throwing('another string value')), false);
			});

			it('should not match if function does not throw', () => {
				assert.equal(sut.matches(notThrowingFunction), false);
			});

			describe('description', () => {
				let description;
				beforeEach(() => {
					description = new __.Description();
				});

				it('should contain exception matcher description', () => {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('a function throwing "a string value"'));
				});

				it('should say if nothing was thrown', () => {

					sut.describeMismatch(notThrowingFunction, description);

					__.assertThat(description.get(), __.equalTo('Function notThrowingFunction did not throw anything'));
				});

				it('should contain exception mismatch description', () => {

					sut.describeMismatch(throwing('another string value'), description);

					__.assertThat(description.get(), __.equalTo('thrown object: was "another string value"'));
				});
			});
		});

		describe('with a matcher', () => {
			function throwingAssertionErrorFunction(message) {
				return () => {
					throw new AssertionError(message);
				};
			}

			function assertionErrorWithMessage(valueOrMatcher) {
				return __.allOf(
					__.instanceOf(AssertionError),
					new __.FeatureMatcher(valueOrMatcher, 'AssertionError with message', 'message')
				);
			}

			let sut;
			beforeEach(() => {
				sut = __.throws(assertionErrorWithMessage('the reason'));
			});

			it('should not match if argument is not a function', () => {
				assert.equal(sut.matches('a string value'), false);
			});

			it('should match if thrown exception matches expectation', () => {
				const fn = throwingAssertionErrorFunction('the reason');

				assert.ok(sut.matches(fn));
			});

			it('should not match if thrown exception does not match expectation', () => {
				const fn = throwingAssertionErrorFunction('another reason');

				assert.equal(sut.matches(fn), false);
			});

			it('should not match if function does not throw', () => {
				assert.equal(sut.matches(notThrowingFunction), false);
			});

			describe('description', () => {
				let description;
				beforeEach(() => {
					description = new __.Description();
				});

				it('should contain matcher description', () => {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('a function throwing (an instance of AssertionError and AssertionError with message \"the reason\")'));
				});

				it('should say if nothing was thrown', () => {

					sut.describeMismatch(notThrowingFunction, description);

					__.assertThat(description.get(), __.equalTo('Function notThrowingFunction did not throw anything'));
				});

				it('should contain mismatching type', () => {

					sut.describeMismatch(throwingErrorFunction, description);

					__.assertThat(description.get(), __.allOf(
						__.containsString('thrown object: an instance of AssertionError: {'),
						__.containsString('} is a Error\nAssertionError with message \"the reason\": message was \"an error\"\n\tfor {')
					));
				});
			});
		});
	});
});
