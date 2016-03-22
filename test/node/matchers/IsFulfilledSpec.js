'use strict';

const q = require('q');
const __ = require('../../..');
const assertTrue = require('../asserts').assertTrue;
const assertFalse = require('../asserts').assertFalse;

describe('IsFulfilled', () => {

	it('should provide a better readable alias', () => {
		__.assertThat(__.isFulfilledWith, __.is(__.fulfilled));
	});

	describe('fulfilled', () => {
		describe('without argument', () => {
			let sut;
			beforeEach(() => {
				sut = __.fulfilled();
			});

			it('should return a promise', () => {
				const aFulfilledPromise = q('a value');

				assertTrue(q.isPromise(sut.matches(aFulfilledPromise)));
			});

			it('should match fulfilled promises', (done) => {
				const aFulfilledPromise = q('a value');

				sut.matches(aFulfilledPromise).done((value) => {
					assertTrue(value);
					done();
				});
			});

			it('should not match rejected promises', (done) => {
				const aRejectedPromise = q.reject('rejected for a reason');

				sut.matches(aRejectedPromise).done((value) => {
					assertFalse(value);
					done();
				});
			});

			it('should wait for pending promises', (done) => {
				const deferred = q.defer();

				sut.matches(deferred.promise).done((value) => {
					assertTrue(value);
					done();
				});

				deferred.resolve();
			});

			it('should describe nicely', () => {
				const description = new __.Description();

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a fulfilled promise'));
			});
		});

		describe('with a value', () => {
			let sut;
			beforeEach(() => {
				sut = __.fulfilled('a value');
			});

			it('should return a promise', () => {
				const aFulfilledPromise = q('a value');

				assertTrue(q.isPromise(sut.matches(aFulfilledPromise)));
			});

			it('should match fulfilled promise with equivalent value', (done) => {
				const aFulfilledPromise = q('a value');

				sut.matches(aFulfilledPromise).done((value) => {
					assertTrue(value);
					done();
				});
			});

			it('should not match fulfilled promise with different value', (done) => {
				const aFulfilledPromise = q('another value');

				sut.matches(aFulfilledPromise).done((value) => {
					assertFalse(value);
					done();
				});
			});

			it('should not match rejected promise with expected value reason', (done) => {
				const aRejectedPromise = q.reject('a value');

				sut.matches(aRejectedPromise).done((value) => {
					assertFalse(value);
					done();
				});
			});

			it('should wait for pending promises', (done) => {
				const deferred = q.defer();

				sut.matches(deferred.promise).done((value) => {
					assertTrue(value);
					done();
				});

				deferred.resolve('a value');
			});

			describe('description', () => {
				let description;
				beforeEach(() => {
					description = new __.Description();
				});

				it('should contain value', () => {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('a promise fulfilled with "a value"'));
				});

				it('should contain mismatched value', (done) => {
					const actual = q('another value');

					sut.describeMismatch(actual, description).done(() => {
						__.assertThat(description.get(), __.equalTo('fulfillment value: was "another value"'));
						done();
					});
				});

				it('should contain rejected reason', (done) => {
					const actual = q.reject('for a reason');

					sut.describeMismatch(actual, description).done(() => {
						__.assertThat(description.get(), __.allOf(__.containsString('was'), __.containsString('rejected'), __.containsString('"for a reason"')));
						done();
					});
				});
			});
		});

		describe('with a matcher', () => {
			let sut;
			beforeEach(() => {
				sut = __.fulfilled(__.containsString('expected'));
			});

			it('should match fulfilled promise with matching values', (done) => {
				const aFulfilledPromise = q('expected value');

				sut.matches(aFulfilledPromise).done((value) => {
					assertTrue(value);
					done();
				});
			});

			it('should not match fulfilled promise with nonmatching value', (done) => {
				const aFulfilledPromise = q('another value');

				sut.matches(aFulfilledPromise).done((value) => {
					assertFalse(value);
					done();
				});
			});

			it('should not match rejected promise with matching reason', (done) => {
				const aRejectedPromise = q.reject('rejected for expected reason');

				sut.matches(aRejectedPromise).done((value) => {
					assertFalse(value);
					done();
				});
			});

			it('should wait for pending promises', (done) => {
				const deferred = q.defer();

				sut.matches(deferred.promise).done((value) => {
					assertTrue(value);
					done();
				});

				deferred.resolve('expected value');
			});

			describe('description', () => {
				let description;
				beforeEach(() => {
					description = new __.Description();
				});

				it('should contain matcher description', () => {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('a promise fulfilled with a string containing "expected"'));
				});

				it('should contain mismatched value', (done) => {
					const actual = q('another value');

					sut.describeMismatch(actual, description).done(() => {
						__.assertThat(description.get(), __.equalTo('fulfillment value: was "another value"'));
						done();
					});
				});

				it('should contain mismatch description', (done) => {
					sut = __.fulfilled(__.hasProperties({
						expected: 'value',
						other: 'property'
					}));

					const actual = q({expected: 'another value', other: 'property'});

					sut.describeMismatch(actual, description).done(() => {
						__.assertThat(description.get(), __.equalTo('fulfillment value: expected was "another value"'));
						done();
					});
				});

				it('should contain rejected reason', (done) => {
					const actual = q.reject('for a reason');

					sut.describeMismatch(actual, description).done(() => {
						__.assertThat(description.get(), __.allOf(__.containsString('was'), __.containsString('rejected'), __.containsString('"for a reason"')));
						done();
					});
				});
			});
		});

		describe('with a promising matcher', () => {
			let sut;
			beforeEach(() => {
				sut = __.fulfilled(__.contains(__.willBe('expected')));
			});

			it('should match fulfilled promise with matching values', (done) => {
				const aFulfilledPromise = q([
					q('expected')
				]);

				sut.matches(aFulfilledPromise).done((value) => {
					assertTrue(value);
					done();
				});
			});

			it('should not match fulfilled promise with nonmatching value', (done) => {
				const aFulfilledPromise = q([
					q('another value')
				]);

				sut.matches(aFulfilledPromise).done((value) => {
					assertFalse(value);
					done();
				});
			});

			it('should wait for pending promises', (done) => {
				const deferred = q.defer();
				const aFulfilledPromiseContainingAPendingPromise = q([deferred.promise]);

				sut.matches(aFulfilledPromiseContainingAPendingPromise).done((value) => {
					assertTrue(value);
					done();
				});

				deferred.resolve('expected');
			});

			describe('description', () => {
				let description;
				beforeEach(() => {
					description = new __.Description();
				});

				it('should contain matcher description', () => {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('a promise fulfilled with [a promise fulfilled with "expected"]'));
				});

				it('should contain mismatch description', (done) => {

					const actual = q([q('another value')]);

					sut.describeMismatch(actual, description).done(() => {
						__.assertThat(description.get(), __.equalTo('fulfillment value: item 0: fulfillment value: was "another value"\n'));
						done();
					});
				});
			});
		});
	});
});
