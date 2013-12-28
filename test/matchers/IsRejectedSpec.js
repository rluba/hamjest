'use strict';

var q = require('q')
	, IsRejected = require('../../lib/matchers/IsRejected')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	;

describe('IsRejected', function () {

	describe('rejected', function () {
		var rejected = IsRejected.rejected;

		describe('without argument', function () {
			var sut;
			beforeEach(function () {
				sut = rejected();
			});

			it('should return a matcher', function () {
				assertTrue(__.isMatcher(sut));
			});

			it('should not match fulfilled promises', function () {
				var aFulfilledPromise = q('a value');

				assertFalse(sut.matches(aFulfilledPromise));
			});

			it('should match rejected promises', function () {
				var aRejectedPromise = q.reject('rejected for a reason');

				assertTrue(sut.matches(aRejectedPromise));
			});

			it('should not match pending promises', function () {
				var aPendingPromise = q.defer().promise;

				assertFalse(sut.matches(aPendingPromise));
			});

			it('should describe nicely', function () {
				var description = new Description();

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('rejected promise'));
			});
		});

		describe('with a value', function () {
			var sut;
			beforeEach(function () {
				sut = rejected('a reason');
			});

			it('should return a matcher', function () {
				assertTrue(__.isMatcher(sut));
			});

			it('should not match fulfilled promise with matching value', function () {
				var aFulfilledPromise = q('a reason');

				assertFalse(sut.matches(aFulfilledPromise));
			});

			it('should match rejected promise with same reason', function () {
				var aRejectedPromise = q.reject('a reason');

				assertTrue(sut.matches(aRejectedPromise));
			});

			it('should not match rejected promise with different reason', function () {
				var aRejectedPromise = q.reject('another reason');

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

				it('should contain reason', function () {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('rejected promise ("a reason")'));
				});

				it('should contain fulfilled value', function () {
					var actual = q('a value');

					sut.describeMismatch(actual, description);

					__.assertThat(description.get(), __.allOf(__.containsString('was'), __.containsString('fulfilled'), __.containsString('"a value"')));
				});

				it('should contain mismatched reason', function () {
					var actual = q.reject('another reason');

					sut.describeMismatch(actual, description);

					__.assertThat(description.get(), __.equalTo('was rejected with "another reason"'));
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
				sut = rejected(__.containsString('expected'));
			});

			it('should return a matcher', function () {
				assertTrue(__.isMatcher(sut));
			});

			it('should not match fulfilled promise with matching value', function () {
				var aFulfilledPromise = q('expected value');

				assertFalse(sut.matches(aFulfilledPromise));
			});

			it('should match rejected promises with matching reason', function () {
				var aRejectedPromise = q.reject('rejected for expected reason');

				assertTrue(sut.matches(aRejectedPromise));
			});

			it('should not match rejected promises with different reason', function () {
				var aRejectedPromise = q.reject('rejected for a reason');

				assertFalse(sut.matches(aRejectedPromise));
			});

			it('should not match pending promises', function () {
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

					__.assertThat(description.get(), __.equalTo('rejected promise (a string containing "expected")'));
				});

				it('should contain fulfilled value', function () {
					var actual = q('a value');

					sut.describeMismatch(actual, description);

					__.assertThat(description.get(), __.allOf(__.containsString('was'), __.containsString('fulfilled'), __.containsString('"a value"')));
				});

				it('should contain mismatched reason', function () {
					var actual = q.reject('another reason');

					sut.describeMismatch(actual, description);

					__.assertThat(description.get(), __.equalTo('was rejected with "another reason"'));
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
