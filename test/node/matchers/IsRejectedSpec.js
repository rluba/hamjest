'use strict';

const q = require('q');
const __ = require('../../..');
const assertTrue = require('../asserts').assertTrue;
const assertFalse = require('../asserts').assertFalse;

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
				const aFulfilledPromise = q('a value');

				assertTrue(q.isPromise(sut.matches(aFulfilledPromise)));
			});

			it('should not match fulfilled promises', (done) => {
				const aFulfilledPromise = q('a value');

				sut.matches(aFulfilledPromise).done((value) => {
					assertFalse(value);
					done();
				});
			});

			it('should match rejected promises', (done) => {
				const aRejectedPromise = q.reject('rejected for a reason');

				sut.matches(aRejectedPromise).done((value) => {
					assertTrue(value);
					done();
				});
			});

			it('should wait for pending promises', (done) => {
				const deferred = q.defer();

				sut.matches(deferred.promise).done((value) => {
					assertTrue(value);
					done();
				});

				deferred.reject();
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
				sut = __.rejected('a reason');
			});

			it('should return a promise', () => {
				const aFulfilledPromise = q('a value');

				assertTrue(q.isPromise(sut.matches(aFulfilledPromise)));
			});

			it('should not match fulfilled promise with matching value', (done) => {
				const aFulfilledPromise = q('a reason');

				sut.matches(aFulfilledPromise).done((value) => {
					assertFalse(value);
					done();
				});
			});

			it('should match rejected promise with same reason', (done) => {
				const aRejectedPromise = q.reject('a reason');

				sut.matches(aRejectedPromise).done((value) => {
					assertTrue(value);
					done();
				});
			});

			it('should not match rejected promise with different reason', (done) => {
				const aRejectedPromise = q.reject('another reason');

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

				deferred.reject('a reason');
			});

			describe('description', () => {
				let description;
				beforeEach(() => {
					description = new __.Description();
				});

				it('should contain reason', () => {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('a promise rejected with "a reason"'));
				});

				it('should contain fulfilled value', (done) => {
					const actual = q('a value');

					sut.describeMismatch(actual, description).done(() => {
						__.assertThat(description.get(), __.allOf(__.containsString('was'), __.containsString('fulfilled'), __.containsString('"a value"')));
						done();
					});
				});

				it('should contain mismatched reason', (done) => {
					const actual = q.reject('another reason');

					sut.describeMismatch(actual, description).done(() => {
						__.assertThat(description.get(), __.equalTo('rejection value was "another reason"'));
						done();
					});
				});
			});
		});

		describe('with a matcher', () => {
			let sut;
			beforeEach(() => {
				sut = __.rejected(__.containsString('expected'));
			});

			it('should return a promise', () => {
				const aFulfilledPromise = q('a value');

				assertTrue(q.isPromise(sut.matches(aFulfilledPromise)));
			});

			it('should not match fulfilled promise with matching value', (done) => {
				const aFulfilledPromise = q('expected value');

				sut.matches(aFulfilledPromise).done((value) => {
					assertFalse(value);
					done();
				});
			});

			it('should match rejected promises with matching reason', (done) => {
				const aRejectedPromise = q.reject('rejected for expected reason');

				sut.matches(aRejectedPromise).done((value) => {
					assertTrue(value);
					done();
				});
			});

			it('should not match rejected promises with different reason', (done) => {
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

				deferred.reject('expected reason');
			});

			describe('description', () => {
				let description;

				beforeEach(() => {
					description = new __.Description();
				});

				it('should contain matcher description', () => {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('a promise rejected with a string containing "expected"'));
				});

				it('should contain fulfilled value', (done) => {
					const actual = q('a value');

					sut.describeMismatch(actual, description).done(() => {
						__.assertThat(description.get(), __.allOf(__.containsString('was'), __.containsString('fulfilled'), __.containsString('"a value"')));
						done();
					});
				});

				it('should contain mismatched description', (done) => {
					const actual = q.reject('another reason');

					sut.describeMismatch(actual, description).done(() => {
						__.assertThat(description.get(), __.equalTo('rejection value was "another reason"'));
						done();
					});
				});
			});
		});
	});
});
