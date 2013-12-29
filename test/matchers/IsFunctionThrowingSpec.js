'use strict';

var AssertionError = require('assertion-error')
	, IsFunctionThrowing = require('../../lib/matchers/IsFunctionThrowing')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	;

describe('ThrowsError', function () {

	describe('fulfilled', function () {
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

			it('should return a matcher', function () {
				assertTrue(__.isMatcher(sut));
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

					__.assertThat(description.get(), __.equalTo('did not throw anything'));
				});
			});
		});

		describe('with a type', function () {
			function throwingAssertionErrorFunction() {
				throw new AssertionError('an assertion error');
			}

			var sut;
			beforeEach(function () {
				sut = throws(AssertionError);
			});

			it('should return a matcher', function () {
				assertTrue(__.isMatcher(sut));
			});

			it('should not match if argument is not a function', function () {
				assertFalse(sut.matches('a string value'));
			});

			it('should match if function throws expected type', function () {
				assertTrue(sut.matches(throwingAssertionErrorFunction));
			});

			it('should not match if function does not throw', function () {
				assertFalse(sut.matches(notThrowingFunction));
			});

			it('should not match if function throws different type', function () {
				assertFalse(sut.matches(throwingErrorFunction));
			});

			describe('description', function () {
				var description;

				beforeEach(function () {
					description = new Description();
				});

				it('should contain type name', function () {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('a function throwing an instance of AssertionError'));
				});

				it('should say if nothing was thrown', function () {

					sut.describeMismatch(notThrowingFunction, description);

					__.assertThat(description.get(), __.equalTo('did not throw anything'));
				});

				it('should contain mismatching type', function () {

					sut.describeMismatch(throwingErrorFunction, description);

					__.assertThat(description.get(), __.equalTo('{} is a Error'));
				});
			});
		});
	});
});
