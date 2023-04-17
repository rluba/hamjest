'use strict';

const _ = require('lodash');
const AssertionError = require('assertion-error');

const __ = require('../..');
const TestMatcher = require('./TestMatcher');

describe('promiseThat', () => {

	it('should return promise', () => {

		const result = __.promiseThat('a value', new TestMatcher(() => true));

		__.assertThat(result, __.is(__.promise()));
	});

	it('should pass given value to matcher', (done) => {
		let passedValue;

		__.promiseThat('a value', new TestMatcher((value) => {
			passedValue = value;
			return true;
		})).then(
			() => {
				__.assertThat(passedValue, __.is('a value'));
				done();
			},
			() => {
				throw new Error('Should not be rejected');
			}
		);
	});

	it('should fulfill promise if matcher matches', (done) => {
		const input = 'expected value';

		__.promiseThat(input, __.is('expected value')).then(
			() => {
				done();
			},
			() => {
				throw new Error('Should not be rejected');
			}
		);
	});

	it('should resolve if matcher returns promise resolving to true', (done) => {

		__.promiseThat('a value', new TestMatcher(() => {
			return Promise.resolve(true);
		})).then(
			() => {
				done();
			},
			() => {
				throw new Error('Should not be rejected');
			}
		);
	});

	it('should reject promise with AssertionError if matcher resolves to false', (done) => {

		__.promiseThat('a value', new TestMatcher(() => {
			return Promise.resolve(false);
		})).then(
			() => {
				throw new Error('Should not be fulfilled');
			},
			(reason) => {
				__.assertThat(reason, __.instanceOf(AssertionError));
				done();
			}
		);
	});

	it('should defer result until matcher promise resolves', (done) => {
		let resolveFn;
		const deferred = new Promise((resolve) => {
			resolveFn = resolve;
		});

		__.promiseThat('a value', new TestMatcher(() => {
			return deferred;
		}))
		.then(done, done);

		resolveFn(true);
	});

	it('should allow a message as first parameter', () => {
		const message = 'Some explanation';

		return __.promiseThat(message, 'different value', __.is('expected value')).then(
			() => {
				throw new Error('Should not be fulfilled');
			},
			(reason) => {
				__.assertThat(reason, __.instanceOf(AssertionError));
				__.assertThat(reason.message, __.containsString(message));
			}
		);
	});

	it('should forward rejection if matcher returns rejecting promise', () => {
		const rejectionValue = new Error('some reason');
		const rejectingMatcher = new TestMatcher(() => {
			return Promise.reject(rejectionValue);
		});

		return __.promiseThat('a value', rejectingMatcher)
			.then(
				() => {
					throw new Error('Should not be fulfilled');
				},
				(reason) => {
					__.assertThat(reason, __.is(rejectionValue));
				}
			);
	});

	it('should allow matchers to describe mismatch asynchronously', (done) => {
		let resolveFn;
		const deferred = new Promise((resolve) => {
			resolveFn = resolve;
		});
		const matcher = _.create(new __.Matcher(), {
			matches() {
				return false;
			},
			describeTo(description) {
				description.append('Matcher description');
			},
			describeMismatch(__actual, description) {
				return deferred.then(() => {
					description.append('Deferred mismatch description');
				});
			}
		});

		__.promiseThat('a value', matcher).then(
			() => {
				throw new Error('Should not be fulfilled');
			},
			(reason) => {
				__.assertThat(reason, __.instanceOf(AssertionError));
				__.assertThat(reason.message, __.containsString('Deferred mismatch description'));
			}
		)
		.then(done, done);

		resolveFn();
	});

	it('should pass diff representations to AssertionError', (done) => {
		const testMatcher = new TestMatcher(() => { return false; });
		testMatcher.getExpectedForDiff = () => {
			return 'expected for diff';
		};
		testMatcher.formatActualForDiff = function (actual) {
			return Promise.resolve('actual for diff: ' + actual);
		};

		__.promiseThat('actual value', testMatcher).then(
			() => {
				throw new Error('Should not be fulfilled');
			},
			(reason) => {
				__.assertThat(reason, __.hasProperties({
					expected: 'expected for diff',
					actual: 'actual for diff: actual value'
				}));
				done();
			}
		);
	});
});
