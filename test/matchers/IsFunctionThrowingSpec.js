'use strict';

var AssertionError = require('assertion-error')
	, IsFunctionThrowing = require('../../lib/matchers/IsFunctionThrowing')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	;

describe('IsFunctionThrowing', function () {

	describe('throws', function () {
		var throws = IsFunctionThrowing.throws;

		function throwingErrorFunction() {
			throw new Error('an error');
		}
		function notThrowingFunction() {
		}

		describe('without argument', function () {
			var sut;
			beforeEach(function () {
				sut = throws();
			});

			it('should not match if argument is not a function', function () {
				assertFalse(sut.matches('a string value'));
			});

			it('should match if function throws', function () {
				assertTrue(sut.matches(throwingErrorFunction));
			});

			it('should not match if function does not throw', function () {
				assertFalse(sut.matches(notThrowingFunction));
			});

			describe('description', function () {
				var description;

				beforeEach(function () {
					description = new Description();
				});

				it('should be nice', function () {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('a function throwing anything'));
				});

				it('should say if nothing was thrown', function () {

					sut.describeMismatch(notThrowingFunction, description);

					__.assertThat(description.get(), __.equalTo('Function notThrowingFunction did not throw anything'));
				});
			});
		});

		describe('with a value', function () {
			function throwing(value) {
				return function () {
					throw value;
				};
			}

			var sut;
			beforeEach(function () {
				sut = throws('a string value');
			});

			it('should not match if argument is not a function', function () {
				assertFalse(sut.matches('a string value'));
			});

			it('should match if function throws expected value', function () {
				assertTrue(sut.matches(throwing('a string value')));
			});

			it('should not match if function throws something different', function () {
				assertFalse(sut.matches(throwing('another string value')));
			});

			it('should not match if function does not throw', function () {
				assertFalse(sut.matches(notThrowingFunction));
			});

			describe('description', function () {
				var description;

				beforeEach(function () {
					description = new Description();
				});

				it('should contain exception matcher description', function () {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('a function throwing "a string value"'));
				});

				it('should say if nothing was thrown', function () {

					sut.describeMismatch(notThrowingFunction, description);

					__.assertThat(description.get(), __.equalTo('Function notThrowingFunction did not throw anything'));
				});

				it('should contain exception mismatch description', function () {

					sut.describeMismatch(throwing('another string value'), description);

					__.assertThat(description.get(), __.equalTo('thrown object: was "another string value"'));
				});
			});
		});

		describe('with a matcher', function () {
			function throwingAssertionErrorFunction(message) {
				return function () {
					throw new AssertionError(message);
				};
			}

			function assertionErrorWithMessage(matcherOrValue) {
				return __.allOf(
					__.instanceOf(AssertionError),
					new __.FeatureMatcher(matcherOrValue, 'AssertionError with message', 'message')
				);
			}

			var sut;
			beforeEach(function () {
				sut = throws(assertionErrorWithMessage('the reason'));
			});

			it('should not match if argument is not a function', function () {
				assertFalse(sut.matches('a string value'));
			});

			it('should match if thrown exception matches expectation', function () {
				var fn = throwingAssertionErrorFunction('the reason');

				assertTrue(sut.matches(fn));
			});

			it('should not match if thrown exception does not match expectation', function () {
				var fn = throwingAssertionErrorFunction('another reason');

				assertFalse(sut.matches(fn));
			});

			it('should not match if function does not throw', function () {
				assertFalse(sut.matches(notThrowingFunction));
			});

			describe('description', function () {
				var description;

				beforeEach(function () {
					description = new Description();
				});

				it('should contain matcher description', function () {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('a function throwing (an instance of AssertionError and AssertionError with message \"the reason\")'));
				});

				it('should say if nothing was thrown', function () {

					sut.describeMismatch(notThrowingFunction, description);

					__.assertThat(description.get(), __.equalTo('Function notThrowingFunction did not throw anything'));
				});

				it('should contain mismatching type', function () {

					sut.describeMismatch(throwingErrorFunction, description);

					__.assertThat(description.get(), __.allOf(
						__.containsString('thrown object: an instance of AssertionError: {'),
						__.containsString('} is a Error\nAssertionError with message \"the reason\": message was \"an error\"\nfor {')
					));
				});
			});
		});
	});
});
