'use strict';

const _ = require('lodash');
const assert = require('assert');
const Bluebird = require('bluebird');

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
				const aFulfilledPromise = Bluebird.resolve('a value');

				const result = sut.matches(aFulfilledPromise);

				assert.ok(result);
				assert.ok(_.isFunction(result.then));
			});

			it('should match fulfilled promises', () => {
				const aFulfilledPromise = Bluebird.resolve('a value');

				return sut.matches(aFulfilledPromise).then((value) => {
					assert.ok(value);
				});
			});

			it('should not match rejected promises', () => {
				const aRejectedPromise = Bluebird.reject(new Error('rejected for a reason'));

				return sut.matches(aRejectedPromise).then((value) => {
					assert.equal(value, false);
				});
			});

			it('should wait for pending promises', (done) => {
				let resolveFn;
				const deferred = new Bluebird((resolve) => {
					resolveFn = resolve;
				});

				sut.matches(deferred).then((value) => {
					assert.ok(value);
				})
				.nodeify(done);

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
				const aFulfilledPromise = Bluebird.resolve('a value');

				const result = sut.matches(aFulfilledPromise);

				assert.ok(result);
				assert.ok(_.isFunction(result.then));
			});

			it('should match fulfilled promise with equivalent value', () => {
				const aFulfilledPromise = Bluebird.resolve('a value');

				return sut.matches(aFulfilledPromise).then((value) => {
					assert.ok(value);
				});
			});

			it('should not match fulfilled promise with different value', () => {
				const aFulfilledPromise = Bluebird.resolve('another value');

				return sut.matches(aFulfilledPromise).then((value) => {
					assert.equal(value, false);
				});
			});

			it('should not match rejected promise', () => {
				const aRejectedPromise = Bluebird.reject(new Error('a value'));

				return sut.matches(aRejectedPromise).then((value) => {
					assert.equal(value, false);
				});
			});

			it('should wait for pending promises', (done) => {
				let resolveFn;
				const deferred = new Bluebird((resolve) => {
					resolveFn = resolve;
				});

				sut.matches(deferred).then((value) => {
					assert.ok(value);
				})
				.nodeify(done);

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
					const actual = Bluebird.resolve('another value');

					return sut.describeMismatch(actual, description).then(() => {
						__.assertThat(description.get(), __.equalTo('fulfillment value: was "another value"'));
					});
				});

				it('should contain rejected reason', () => {
					const actual = Bluebird.reject(new Error('for a reason'));

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
				const aFulfilledPromise = Bluebird.resolve('expected value');

				return sut.matches(aFulfilledPromise).then((value) => {
					assert.ok(value);
				});
			});

			it('should not match fulfilled promise with nonmatching value', () => {
				const aFulfilledPromise = Bluebird.resolve('another value');

				return sut.matches(aFulfilledPromise).then((value) => {
					assert.equal(value, false);
				});
			});

			it('should not match rejected promise', () => {
				const aRejectedPromise = Bluebird.reject(new Error('rejected for expected reason'));

				return sut.matches(aRejectedPromise).then((value) => {
					assert.equal(value, false);
				});
			});

			it('should wait for pending promises', (done) => {
				let resolveFn;
				const deferred = new Bluebird((resolve) => {
					resolveFn = resolve;
				});

				sut.matches(deferred).then((value) => {
					assert.ok(value);
				})
				.nodeify(done);

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
					const actual = Bluebird.resolve('another value');

					return sut.describeMismatch(actual, description).then(() => {
						__.assertThat(description.get(), __.equalTo('fulfillment value: was "another value"'));
					});
				});

				it('should contain mismatch description', () => {
					sut = __.fulfilled(__.hasProperties({
						expected: 'value',
						other: 'property'
					}));

					const actual = Bluebird.resolve({expected: 'another value', other: 'property'});

					return sut.describeMismatch(actual, description).then(() => {
						__.assertThat(description.get(), __.equalTo('fulfillment value: expected was "another value"'));
					});
				});

				it('should contain rejected reason', () => {
					const actual = Bluebird.reject(new Error('for a reason'));

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
				const aFulfilledPromise = Bluebird.resolve([
					Bluebird.resolve('expected')
				]);

				return sut.matches(aFulfilledPromise).then((value) => {
					assert.ok(value);
				});
			});

			it('should not match fulfilled promise with nonmatching value', () => {
				const aFulfilledPromise = Bluebird.resolve([
					Bluebird.resolve('another value')
				]);

				return sut.matches(aFulfilledPromise).then((value) => {
					assert.equal(value, false);
				});
			});

			it('should wait for pending promises', (done) => {
				let resolveFn;
				const deferred = new Bluebird((resolve) => {
					resolveFn = resolve;
				});
				const aFulfilledPromiseContainingAPendingPromise = Bluebird.resolve([deferred]);

				sut.matches(aFulfilledPromiseContainingAPendingPromise).then((value) => {
					assert.ok(value);
				})
				.nodeify(done);

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

					const actual = Bluebird.resolve([Bluebird.resolve('another value')]);

					return sut.describeMismatch(actual, description).then(() => {
						__.assertThat(description.get(), __.equalTo('fulfillment value: item 0: fulfillment value: was "another value"\n'));
					});
				});
			});
		});
	});
});
