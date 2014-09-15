'use strict';

var q = require('q')
	, IsRejected = require('../../lib/matchers/IsRejected')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	;

describe('IsRejected', function () {

	it('should provide a better readable alias', function () {
		__.assertThat(IsRejected.isRejectedWith, __.is(IsRejected.rejected));
	});

	describe('rejected', function () {
		var rejected = IsRejected.rejected;

		describe('without argument', function () {
			var sut;
			beforeEach(function () {
				sut = rejected();
			});

			it('should return a promise', function () {
				var aFulfilledPromise = q('a value');

				assertTrue(q.isPromise(sut.matches(aFulfilledPromise)));
			});

			it('should not match fulfilled promises', function (done) {
				var aFulfilledPromise = q('a value');

				sut.matches(aFulfilledPromise).done(function (value) {
					assertFalse(value);
					done();
				});
			});

			it('should match rejected promises', function (done) {
				var aRejectedPromise = q.reject('rejected for a reason');

				sut.matches(aRejectedPromise).done(function (value) {
					assertTrue(value);
					done();
				});
			});

			it('should wait for pending promises', function (done) {
				var deferred = q.defer();

				sut.matches(deferred.promise).done(function (value) {
					assertTrue(value);
					done();
				});

				deferred.reject();
			});

			it('should describe nicely', function () {
				var description = new Description();

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a rejected promise'));
			});
		});

		describe('with a value', function () {
			var sut;
			beforeEach(function () {
				sut = rejected('a reason');
			});

			it('should return a promise', function () {
				var aFulfilledPromise = q('a value');

				assertTrue(q.isPromise(sut.matches(aFulfilledPromise)));
			});

			it('should not match fulfilled promise with matching value', function (done) {
				var aFulfilledPromise = q('a reason');

				sut.matches(aFulfilledPromise).done(function (value) {
					assertFalse(value);
					done();
				});
			});

			it('should match rejected promise with same reason', function (done) {
				var aRejectedPromise = q.reject('a reason');

				sut.matches(aRejectedPromise).done(function (value) {
					assertTrue(value);
					done();
				});
			});

			it('should not match rejected promise with different reason', function (done) {
				var aRejectedPromise = q.reject('another reason');

				sut.matches(aRejectedPromise).done(function (value) {
					assertFalse(value);
					done();
				});
			});

			it('should wait for pending promises', function (done) {
				var deferred = q.defer();

				sut.matches(deferred.promise).done(function (value) {
					assertTrue(value);
					done();
				});

				deferred.reject('a reason');
			});

			describe('description', function () {
				var description;

				beforeEach(function () {
					description = new Description();
				});

				it('should contain reason', function () {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('a promise rejected with "a reason"'));
				});

				it('should contain fulfilled value', function (done) {
					var actual = q('a value');

					sut.describeMismatch(actual, description).done(function () {
						__.assertThat(description.get(), __.allOf(__.containsString('was'), __.containsString('fulfilled'), __.containsString('"a value"')));
						done();
					});
				});

				it('should contain mismatched reason', function (done) {
					var actual = q.reject('another reason');

					sut.describeMismatch(actual, description).done(function () {
						__.assertThat(description.get(), __.equalTo('was rejected with "another reason"'));
						done();
					});
				});
			});
		});

		describe('with a matcher', function () {
			var sut;
			beforeEach(function () {
				sut = rejected(__.containsString('expected'));
			});

			it('should return a promise', function () {
				var aFulfilledPromise = q('a value');

				assertTrue(q.isPromise(sut.matches(aFulfilledPromise)));
			});

			it('should not match fulfilled promise with matching value', function (done) {
				var aFulfilledPromise = q('expected value');

				sut.matches(aFulfilledPromise).done(function (value) {
					assertFalse(value);
					done();
				});
			});

			it('should match rejected promises with matching reason', function (done) {
				var aRejectedPromise = q.reject('rejected for expected reason');

				sut.matches(aRejectedPromise).done(function (value) {
					assertTrue(value);
					done();
				});
			});

			it('should not match rejected promises with different reason', function (done) {
				var aRejectedPromise = q.reject('rejected for a reason');

				sut.matches(aRejectedPromise).done(function (value) {
					assertFalse(value);
					done();
				});
			});

			it('should wait for pending promises', function (done) {
				var deferred = q.defer();

				sut.matches(deferred.promise).done(function (value) {
					assertTrue(value);
					done();
				});

				deferred.reject('expected reason');
			});

			describe('description', function () {
				var description;

				beforeEach(function () {
					description = new Description();
				});

				it('should contain matcher description', function () {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('a promise rejected with a string containing "expected"'));
				});

				it('should contain fulfilled value', function (done) {
					var actual = q('a value');

					sut.describeMismatch(actual, description).done(function () {
						__.assertThat(description.get(), __.allOf(__.containsString('was'), __.containsString('fulfilled'), __.containsString('"a value"')));
						done();
					});
				});

				it('should contain mismatched reason', function (done) {
					var actual = q.reject('another reason');

					sut.describeMismatch(actual, description).done(function () {
						__.assertThat(description.get(), __.equalTo('was rejected with "another reason"'));
						done();
					});
				});
			});
		});
	});
});
