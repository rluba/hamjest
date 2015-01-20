'use strict';

var q = require('q')
	, IsFulfilled = require('../../lib/matchers/IsFulfilled')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	;

describe('IsFulfilled', function () {

	it('should provide a better readable alias', function () {
		__.assertThat(IsFulfilled.isFulfilledWith, __.is(IsFulfilled.fulfilled));
	});

	describe('fulfilled', function () {
		var fulfilled = IsFulfilled.fulfilled;

		describe('without argument', function () {
			var sut;
			beforeEach(function () {
				sut = fulfilled();
			});

			it('should return a promise', function () {
				var aFulfilledPromise = q('a value');

				assertTrue(q.isPromise(sut.matches(aFulfilledPromise)));
			});

			it('should match fulfilled promises', function (done) {
				var aFulfilledPromise = q('a value');

				sut.matches(aFulfilledPromise).done(function (value) {
					assertTrue(value);
					done();
				});
			});

			it('should not match rejected promises', function (done) {
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

				deferred.resolve();
			});

			it('should describe nicely', function () {
				var description = new Description();

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a fulfilled promise'));
			});
		});

		describe('with a value', function () {
			var sut;
			beforeEach(function () {
				sut = fulfilled('a value');
			});

			it('should return a promise', function () {
				var aFulfilledPromise = q('a value');

				assertTrue(q.isPromise(sut.matches(aFulfilledPromise)));
			});

			it('should match fulfilled promise with equivalent value', function (done) {
				var aFulfilledPromise = q('a value');

				sut.matches(aFulfilledPromise).done(function (value) {
					assertTrue(value);
					done();
				});
			});

			it('should not match fulfilled promise with different value', function (done) {
				var aFulfilledPromise = q('another value');

				sut.matches(aFulfilledPromise).done(function (value) {
					assertFalse(value);
					done();
				});
			});

			it('should not match rejected promise with expected value reason', function (done) {
				var aRejectedPromise = q.reject('a value');

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

				deferred.resolve('a value');
			});

			describe('description', function () {
				var description;

				beforeEach(function () {
					description = new Description();
				});

				it('should contain value', function () {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('a promise fulfilled with "a value"'));
				});

				it('should contain mismatched value', function (done) {
					var actual = q('another value');

					sut.describeMismatch(actual, description).done(function () {
						__.assertThat(description.get(), __.equalTo('fulfillment value: was "another value"'));
						done();
					});
				});

				it('should contain rejected reason', function (done) {
					var actual = q.reject('for a reason');

					sut.describeMismatch(actual, description).done(function () {
						__.assertThat(description.get(), __.allOf(__.containsString('was'), __.containsString('rejected'), __.containsString('"for a reason"')));
						done();
					});
				});
			});
		});

		describe('with a matcher', function () {
			var sut;
			beforeEach(function () {
				sut = fulfilled(__.containsString('expected'));
			});

			it('should match fulfilled promise with matching values', function (done) {
				var aFulfilledPromise = q('expected value');

				sut.matches(aFulfilledPromise).done(function (value) {
					assertTrue(value);
					done();
				});
			});

			it('should not match fulfilled promise with nonmatching value', function (done) {
				var aFulfilledPromise = q('another value');

				sut.matches(aFulfilledPromise).done(function (value) {
					assertFalse(value);
					done();
				});
			});

			it('should not match rejected promise with matching reason', function (done) {
				var aRejectedPromise = q.reject('rejected for expected reason');

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

				deferred.resolve('expected value');
			});

			describe('description', function () {
				var description;

				beforeEach(function () {
					description = new Description();
				});

				it('should contain matcher description', function () {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('a promise fulfilled with a string containing "expected"'));
				});

				it('should contain mismatched value', function (done) {
					var actual = q('another value');

					sut.describeMismatch(actual, description).done(function () {
						__.assertThat(description.get(), __.equalTo('fulfillment value: was "another value"'));
						done();
					});
				});

				it('should contain mismatch description', function (done) {
					sut = fulfilled(__.hasProperties({
						expected: 'value',
						other: 'property'
					}));

					var actual = q({expected: 'another value', other: 'property'});

					sut.describeMismatch(actual, description).done(function () {
						__.assertThat(description.get(), __.equalTo('fulfillment value: expected was "another value"'));
						done();
					});
				});

				it('should contain rejected reason', function (done) {
					var actual = q.reject('for a reason');

					sut.describeMismatch(actual, description).done(function () {
						__.assertThat(description.get(), __.allOf(__.containsString('was'), __.containsString('rejected'), __.containsString('"for a reason"')));
						done();
					});
				});
			});
		});

		describe('with a promising matcher', function () {
			var sut;
			beforeEach(function () {
				sut = fulfilled(__.contains(__.willBe('expected')));
			});

			it('should match fulfilled promise with matching values', function (done) {
				var aFulfilledPromise = q([
					q('expected')
				]);

				sut.matches(aFulfilledPromise).done(function (value) {
					assertTrue(value);
					done();
				});
			});

			it('should not match fulfilled promise with nonmatching value', function (done) {
				var aFulfilledPromise = q([
					q('another value')
				]);

				sut.matches(aFulfilledPromise).done(function (value) {
					assertFalse(value);
					done();
				});
			});

			it('should wait for pending promises', function (done) {
				var deferred = q.defer();
				var aFulfilledPromiseContainingAPendingPromise = q([deferred.promise]);

				sut.matches(aFulfilledPromiseContainingAPendingPromise).done(function (value) {
					assertTrue(value);
					done();
				});

				deferred.resolve('expected');
			});

			describe('description', function () {
				var description;

				beforeEach(function () {
					description = new Description();
				});

				it('should contain matcher description', function () {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('a promise fulfilled with [a promise fulfilled with "expected"]'));
				});

				it('should contain mismatch description', function (done) {

					var actual = q([q('another value')]);

					sut.describeMismatch(actual, description).done(function () {
						__.assertThat(description.get(), __.equalTo('fulfillment value: item 0: fulfillment value: was "another value"\n'));
						done();
					});
				});
			});
		});
	});
});
