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

	it('should pass given value to matcher', async () => {
		let passedValue;

		await __.promiseThat('a value', new TestMatcher((value) => {
			passedValue = value;
			return true;
		}));
		__.assertThat(passedValue, __.is('a value'));
	});

	it('should fulfill promise if matcher matches', async () => {
		const input = 'expected value';

		await __.promiseThat(input, __.is('expected value'));
	});

	it('should resolve if matcher returns promise resolving to true', async () => {

		await __.promiseThat('a value', new TestMatcher(() => {
			return Promise.resolve(true);
		}));
	});

	it('should reject promise with AssertionError if matcher resolves to false', async () => {

		try {
			await __.promiseThat('a value', new TestMatcher(() => Promise.resolve(false)));
			throw new Error('Should not be fulfilled');
		} catch (e) {
			__.assertThat(e, __.instanceOf(AssertionError));
		}
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

	it('should allow a message as first parameter', async () => {
		const message = 'Some explanation';

		try {
			await __.promiseThat(message, 'different value', __.is('expected value'));
			throw new Error('Should not be fulfilled');
		} catch (e) {
			__.assertThat(e, __.instanceOf(AssertionError));
			__.assertThat(e.message, __.containsString(message));
		}
	});

	it('should forward rejection if matcher returns rejecting promise', async () => {
		const rejectionValue = new Error('some reason');
		const rejectingMatcher = new TestMatcher(() => Promise.reject(rejectionValue));

		try {
			await __.promiseThat('a value', rejectingMatcher);
			throw new Error('Should not be fulfilled');
		} catch (e) {
			__.assertThat(e, __.is(rejectionValue));
		}
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

	it('should pass diff representations to AssertionError', async () => {
		const testMatcher = new TestMatcher(() => { return false; });
		testMatcher.getExpectedForDiff = () => {
			return 'expected for diff';
		};
		testMatcher.formatActualForDiff = function (actual) {
			return Promise.resolve('actual for diff: ' + actual);
		};

		try {
			await __.promiseThat('actual value', testMatcher);
			throw new Error('Should not be fulfilled');
		} catch (e) {
			__.assertThat(e, __.hasProperties({
				expected: 'expected for diff',
				actual: 'actual for diff: actual value'
			}));
		}
	});
});
