'use strict';

const _ = require('lodash');
const assert = require('assert');

const __ = require('../../..');

describe('IsRejected', () => {

	it('should provide a better readable alias', () => {
		__.assertThat(__.isRejectedWith, __.is(__.rejected));
	});

	describe('rejected', () => {
		describe('without argument', () => {
			let sut;
			beforeEach(() => {
				sut = __.rejected();
			});

			it('should return a promise', () => {
				const aFulfilledPromise = Promise.resolve('a value');

				const result = sut.matches(aFulfilledPromise);

				assert.ok(result);
				assert.ok(_.isFunction(result.then));
			});

			it('should not match fulfilled promises', () => {
				const aFulfilledPromise = Promise.resolve('a value');

				return sut.matches(aFulfilledPromise).then((value) => {
					assert.equal(value, false);
				});
			});

			it('should match rejected promises', () => {
				const aRejectedPromise = Promise.reject(new Error('rejected for a reason'));

				return sut.matches(aRejectedPromise).then((value) => {
					assert.ok(value);
				});
			});

			it('should wait for pending promises', (done) => {
				let rejectFn;
				const deferred = new Promise((__resolve, reject) => {
					rejectFn = reject;
				});

				sut.matches(deferred).then((value) => {
					assert.ok(value);
				})
				.then(done, done);

				rejectFn(new Error());
			});

			it('should describe nicely', () => {
				const description = new __.Description();

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a rejected promise'));
			});
		});

		describe('with a value', () => {
			let sut;
			beforeEach(() => {
				sut = __.rejected(__.hasProperty('message', 'a reason'));
			});

			it('should return a promise', () => {
				const aFulfilledPromise = Promise.resolve('a value');

				const result = sut.matches(aFulfilledPromise);

				assert.ok(result);
				assert.ok(_.isFunction(result.then));
			});

			it('should not match fulfilled promise with matching value', () => {
				const aFulfilledPromise = Promise.resolve(new Error('a reason'));

				return sut.matches(aFulfilledPromise).then((value) => {
					assert.equal(value, false);
				});
			});

			it('should match rejected promise with same reason', () => {
				const aRejectedPromise = Promise.reject(new Error('a reason'));

				return sut.matches(aRejectedPromise).then((value) => {
					assert.ok(value);
				});
			});

			it('should not match rejected promise with different reason', () => {
				const aRejectedPromise = Promise.reject(new Error('another reason'));
				aRejectedPromise.catch(() => null);

				return sut.matches(aRejectedPromise).then((value) => {
					assert.equal(value, false);
				});
			});

			it('should wait for pending promises', (done) => {
				let rejectFn;
				const deferred = new Promise((__resolve, reject) => {
					rejectFn = reject;
				});

				sut.matches(deferred).then((value) => {
					assert.ok(value);
				})
				.then(done, done);

				rejectFn(new Error('a reason'));
			});

			describe('description', () => {
				let description;
				beforeEach(() => {
					description = new __.Description();
				});

				it('should contain reason', () => {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('a promise rejected with an object with {message: "a reason"}'));
				});

				it('should contain fulfilled value', () => {
					const actual = Promise.resolve('a value');

					return sut.describeMismatch(actual, description).then(() => {
						__.assertThat(description.get(), __.allOf(__.containsString('was'), __.containsString('fulfilled'), __.containsString('"a value"')));
					});
				});

				it('should contain mismatched reason', () => {
					const actual = Promise.reject(new Error('another reason'));

					return sut.describeMismatch(actual, description).then(() => {
						__.assertThat(description.get(), __.equalTo('rejection value message was "another reason"'));
					});
				});
			});
		});

		describe('with a matcher', () => {
			let sut;
			beforeEach(() => {
				sut = __.rejected(__.hasProperty('message', __.containsString('expected')));
			});

			it('should return a promise', () => {
				const aFulfilledPromise = Promise.resolve('a value');

				const result = sut.matches(aFulfilledPromise);

				assert.ok(result);
				assert.ok(_.isFunction(result.then));
			});

			it('should not match fulfilled promise with matching value', () => {
				const aFulfilledPromise = Promise.resolve(new Error('expected value'));

				return sut.matches(aFulfilledPromise).then((value) => {
					assert.equal(value, false);
				});
			});

			it('should match rejected promises with matching reason', () => {
				const aRejectedPromise = Promise.reject(new Error('rejected for expected reason'));

				return sut.matches(aRejectedPromise).then((value) => {
					assert.ok(value);
				});
			});

			it('should not match rejected promises with different reason', () => {
				const aRejectedPromise = Promise.reject(new Error('rejected for a reason'));

				return sut.matches(aRejectedPromise).then((value) => {
					assert.equal(value, false);
				});
			});

			it('should wait for pending promises', (done) => {
				let rejectFn;
				const deferred = new Promise((__resolve, reject) => {
					rejectFn = reject;
				});

				sut.matches(deferred).then((value) => {
					assert.ok(value);
				})
				.then(done, done);

				rejectFn(new Error('expected reason'));
			});

			describe('description', () => {
				let description;

				beforeEach(() => {
					description = new __.Description();
				});

				it('should contain matcher description', () => {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('a promise rejected with an object with {message: a string containing "expected"}'));
				});

				it('should contain fulfilled value', () => {
					const actual = Promise.resolve('a value');

					return sut.describeMismatch(actual, description).then(() => {
						__.assertThat(description.get(), __.allOf(__.containsString('was'), __.containsString('fulfilled'), __.containsString('"a value"')));
					});
				});

				it('should contain mismatched description', () => {
					const actual = Promise.reject(new Error('another reason'));

					return sut.describeMismatch(actual, description).then(() => {
						__.assertThat(description.get(), __.equalTo('rejection value message was "another reason"'));
					});
				});
			});
		});
	});
});
