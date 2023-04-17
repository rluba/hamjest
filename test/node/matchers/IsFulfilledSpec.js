'use strict';

const _ = require('lodash');
const assert = require('assert');

const __ = require('../../..');

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
				const aFulfilledPromise = Promise.resolve('a value');

				const result = sut.matches(aFulfilledPromise);

				assert.ok(result);
				assert.ok(_.isFunction(result.then));
			});

			it('should match fulfilled promises', () => {
				const aFulfilledPromise = Promise.resolve('a value');

				return sut.matches(aFulfilledPromise).then((value) => {
					assert.ok(value);
				});
			});

			it('should not match rejected promises', () => {
				const aRejectedPromise = Promise.reject(new Error('rejected for a reason'));

				return sut.matches(aRejectedPromise).then((value) => {
					assert.equal(value, false);
				});
			});

			it('should wait for pending promises', (done) => {
				let resolveFn;
				const deferred = new Promise((resolve) => {
					resolveFn = resolve;
				});

				sut.matches(deferred).then((value) => {
					assert.ok(value);
				})
				.then(done, done);

				resolveFn();
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
				const aFulfilledPromise = Promise.resolve('a value');

				const result = sut.matches(aFulfilledPromise);

				assert.ok(result);
				assert.ok(_.isFunction(result.then));
			});

			it('should match fulfilled promise with equivalent value', () => {
				const aFulfilledPromise = Promise.resolve('a value');

				return sut.matches(aFulfilledPromise).then((value) => {
					assert.ok(value);
				});
			});

			it('should not match fulfilled promise with different value', () => {
				const aFulfilledPromise = Promise.resolve('another value');

				return sut.matches(aFulfilledPromise).then((value) => {
					assert.equal(value, false);
				});
			});

			it('should not match rejected promise', () => {
				const aRejectedPromise = Promise.reject(new Error('a value'));

				return sut.matches(aRejectedPromise).then((value) => {
					assert.equal(value, false);
				});
			});

			it('should wait for pending promises', (done) => {
				let resolveFn;
				const deferred = new Promise((resolve) => {
					resolveFn = resolve;
				});

				sut.matches(deferred).then((value) => {
					assert.ok(value);
				})
				.then(done, done);

				resolveFn('a value');
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

				it('should contain mismatched value', () => {
					const actual = Promise.resolve('another value');

					return sut.describeMismatch(actual, description).then(() => {
						__.assertThat(description.get(), __.equalTo('fulfillment value: was "another value"'));
					});
				});

				it('should contain rejected reason', () => {
					const actual = Promise.reject(new Error('for a reason'));

					return sut.describeMismatch(actual, description).then(() => {
						__.assertThat(description.get(), __.allOf(__.containsString('was'), __.containsString('rejected'), __.containsString('"for a reason"')));
					});
				});
			});
		});

		describe('with a matcher', () => {
			let sut;
			beforeEach(() => {
				sut = __.fulfilled(__.containsString('expected'));
			});

			it('should match fulfilled promise with matching values', () => {
				const aFulfilledPromise = Promise.resolve('expected value');

				return sut.matches(aFulfilledPromise).then((value) => {
					assert.ok(value);
				});
			});

			it('should not match fulfilled promise with nonmatching value', () => {
				const aFulfilledPromise = Promise.resolve('another value');

				return sut.matches(aFulfilledPromise).then((value) => {
					assert.equal(value, false);
				});
			});

			it('should not match rejected promise', () => {
				const aRejectedPromise = Promise.reject(new Error('rejected for expected reason'));

				return sut.matches(aRejectedPromise).then((value) => {
					assert.equal(value, false);
				});
			});

			it('should wait for pending promises', (done) => {
				let resolveFn;
				const deferred = new Promise((resolve) => {
					resolveFn = resolve;
				});

				sut.matches(deferred).then((value) => {
					assert.ok(value);
				})
				.then(done, done);

				resolveFn('expected value');
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

				it('should contain mismatched value', () => {
					const actual = Promise.resolve('another value');

					return sut.describeMismatch(actual, description).then(() => {
						__.assertThat(description.get(), __.equalTo('fulfillment value: was "another value"'));
					});
				});

				it('should contain mismatch description', () => {
					sut = __.fulfilled(__.hasProperties({
						expected: 'value',
						other: 'property'
					}));

					const actual = Promise.resolve({expected: 'another value', other: 'property'});

					return sut.describeMismatch(actual, description).then(() => {
						__.assertThat(description.get(), __.equalTo('fulfillment value: expected was "another value"'));
					});
				});

				it('should contain rejected reason', () => {
					const actual = Promise.reject(new Error('for a reason'));

					return sut.describeMismatch(actual, description).then(() => {
						__.assertThat(description.get(), __.allOf(__.containsString('was'), __.containsString('rejected'), __.containsString('"for a reason"')));
					});
				});
			});
		});

		describe('with a promising matcher', () => {
			let sut;
			beforeEach(() => {
				sut = __.fulfilled(__.contains(__.willBe('expected')));
			});

			it('should match fulfilled promise with matching values', () => {
				const aFulfilledPromise = Promise.resolve([
					Promise.resolve('expected')
				]);

				return sut.matches(aFulfilledPromise).then((value) => {
					assert.ok(value);
				});
			});

			it('should not match fulfilled promise with nonmatching value', () => {
				const aFulfilledPromise = Promise.resolve([
					Promise.resolve('another value')
				]);

				return sut.matches(aFulfilledPromise).then((value) => {
					assert.equal(value, false);
				});
			});

			it('should wait for pending promises', (done) => {
				let resolveFn;
				const deferred = new Promise((resolve) => {
					resolveFn = resolve;
				});
				const aFulfilledPromiseContainingAPendingPromise = Promise.resolve([deferred]);

				sut.matches(aFulfilledPromiseContainingAPendingPromise).then((value) => {
					assert.ok(value);
				})
				.then(done, done);

				resolveFn('expected');
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

				it('should contain mismatch description', () => {

					const actual = Promise.resolve([Promise.resolve('another value')]);

					return sut.describeMismatch(actual, description).then(() => {
						__.assertThat(description.get(), __.equalTo('fulfillment value: item 0: fulfillment value: was "another value"\n'));
					});
				});
			});
		});
	});
});
