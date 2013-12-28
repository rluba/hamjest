'use strict';

var q = require('q')
	, IsFulfilled = require('../../lib/matchers/IsFulfilled')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	;

describe('IsFulfilled', function () {

	describe('fulfilled', function () {
		var fulfilled = IsFulfilled.fulfilled;

		describe('without argument', function () {
			var sut;
			beforeEach(function () {
				sut = fulfilled();
			});

			it('should return a matcher', function () {
				assertTrue(__.isMatcher(sut));
			});

			it('should match fulfilled promises', function () {
				var aFulfilledPromise = q('a value');

				assertTrue(sut.matches(aFulfilledPromise));
			});

			it('should not match rejected promises', function () {
				var aRejectedPromise = q.reject('rejected for a reason');

				assertFalse(sut.matches(aRejectedPromise));
			});

			it('should not match pending promises', function () {
				var aPendingPromise = q.defer().promise;

				assertFalse(sut.matches(aPendingPromise));
			});

			it('should describe nicely', function () {
				var description = new Description();

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('fulfilled promise'));
			});
		});

		describe('with a value', function () {
			var sut;
			beforeEach(function () {
				sut = fulfilled('a value');
			});

			it('should return a matcher', function () {
				assertTrue(__.isMatcher(sut));
			});

			it('should match fulfilled promise with equivalent value', function () {
				var aFulfilledPromise = q('a value');

				assertTrue(sut.matches(aFulfilledPromise));
			});

			it('should not match fulfilled promise with different value', function () {
				var aFulfilledPromise = q('another value');

				assertFalse(sut.matches(aFulfilledPromise));
			});

			it('should not match rejected promise with value reason', function () {
				var aRejectedPromise = q.reject('a value');

				assertFalse(sut.matches(aRejectedPromise));
			});

			it('should not match pending promise', function () {
				var aPendingPromise = q.defer().promise;

				assertFalse(sut.matches(aPendingPromise));
			});

			describe('description', function () {
				var description;

				beforeEach(function () {
					description = new Description();
				});

				it('should contain value', function () {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('fulfilled promise ("a value")'));
				});

				it('should contain mismatched value', function () {
					var actual = q('another value');

					sut.describeMismatch(actual, description);

					__.assertThat(description.get(), __.equalTo('was fulfilled with "another value"'));
				});

				it('should contain rejected reason', function () {
					var actual = q.reject('for a reason');

					sut.describeMismatch(actual, description);

					__.assertThat(description.get(), __.allOf(__.containsString('was'), __.containsString('rejected'), __.containsString('"for a reason"')));
				});

				it('should contain pending state', function () {
					var actual = q.defer().promise;

					sut.describeMismatch(actual, description);

					__.assertThat(description.get(), __.allOf(__.containsString('was'), __.containsString('pending')));
				});
			});
		});

		describe('with a matcher', function () {
			var sut;
			beforeEach(function () {
				sut = fulfilled(__.containsString('expected'));
			});

			it('should return a matcher', function () {
				assertTrue(__.isMatcher(sut));
			});

			it('should match fulfilled promise with matching values', function () {
				var aFulfilledPromise = q('expected value');

				assertTrue(sut.matches(aFulfilledPromise));
			});

			it('should not match fulfilled promise with nonmatching value', function () {
				var aFulfilledPromise = q('another value');

				assertFalse(sut.matches(aFulfilledPromise));
			});

			it('should not match rejected promise with matching reason', function () {
				var aRejectedPromise = q.reject('rejected for expected reason');

				assertFalse(sut.matches(aRejectedPromise));
			});

			it('should not match pending promise', function () {
				var aPendingPromise = q.defer().promise;

				assertFalse(sut.matches(aPendingPromise));
			});

			describe('description', function () {
				var description;

				beforeEach(function () {
					description = new Description();
				});

				it('should contain matcher description', function () {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('fulfilled promise (a string containing "expected")'));
				});

				it('should contain mismatched value', function () {
					var actual = q('another value');

					sut.describeMismatch(actual, description);

					__.assertThat(description.get(), __.equalTo('was fulfilled with "another value"'));
				});

				it('should contain rejected reason', function () {
					var actual = q.reject('for a reason');

					sut.describeMismatch(actual, description);

					__.assertThat(description.get(), __.allOf(__.containsString('was'), __.containsString('rejected'), __.containsString('"for a reason"')));
				});

				it('should contain pending state', function () {
					var actual = q.defer().promise;

					sut.describeMismatch(actual, description);

					__.assertThat(description.get(), __.allOf(__.containsString('was'), __.containsString('pending')));
				});
			});
		});
	});
});
