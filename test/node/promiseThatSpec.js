'use strict';

const q = require('q');
const AssertionError = require('assertion-error');
const __ = require('../..');
const fail = require('./asserts').fail;
const TestMatcher = require('./TestMatcher');
const _ = require('lodash');

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
		})).done(
			() => {
				__.assertThat(passedValue, __.is('a value'));
				done();
			},
			() => {
				fail('Should not be rejected');
			}
		);
	});

	it('should fulfill promise if matcher matches', (done) => {
		const input = 'expected value';

		__.promiseThat(input, __.is('expected value')).done(
			() => {
				done();
			},
			() => {
				fail('Should not be rejected');
			}
		);
	});

	it('should resolve if matcher returns promise resolving to true', (done) => {

		__.promiseThat('a value', new TestMatcher(() => {
			return q(true);
		})).done(
			() => {
				done();
			},
			() => {
				fail('Should not be rejected');
			}
		);
	});

	it('should reject promise with AssertionError if matcher resolves to false', (done) => {

		__.promiseThat('a value', new TestMatcher(() => {
			return q.resolve(false);
		})).done(
			() => {
				fail('Should not be fulfilled');
			},
			(reason) => {
				__.assertThat(reason, __.instanceOf(AssertionError));
				done();
			}
		);
	});

	it('should defer result until matcher promise resolves', (done) => {
		const deferred = q.defer();

		const result = __.promiseThat('a value', new TestMatcher(() => {
			return deferred;
		})).then(
			() => {
				done();
			},
			() => {
				fail('Should not be rejected');
			}
		);

		__.assertThat(result.isPending(), __.is(true));
		deferred.fulfill(true);
		result.done();
	});

	it('should allow a message as first parameter', (done) => {
		const message = 'Some explanation';

		__.promiseThat(message, 'different value', __.is('expected value')).done(
			() => {
				fail('Should not be fulfilled');
			},
			(reason) => {
				__.assertThat(reason, __.instanceOf(AssertionError));
				__.assertThat(reason.message, __.containsString(message));
				done();
			}
		);
	});

	it('should forward rejection if matcher returns rejecting promise', (done) => {
		const rejectingMatcher = new TestMatcher(() => {
			return q.reject('some reason');
		});

		__.promiseThat('a value', rejectingMatcher)
			.done(
				() => {
					fail('Should not be fulfilled');
				},
				(reason) => {
					__.assertThat(reason, __.is('some reason'));
					done();
				}
			);
	});

	it('should allow matchers to describe mismatch asynchronously', (done) => {
		const deferred = q.defer();
		const matcher = _.create(new __.Matcher(), {
			matches: () => {
				return false;
			},
			describeTo: function (description) {
				description.append('Matcher description');
			},
			describeMismatch: function (actual, description) {
				return deferred.promise.then(() => {
					description.append('Deferred mismatch description');
				});
			}
		});

		__.promiseThat('a value', matcher).done(
			() => {
				fail('Should not be fulfilled');
			},
			(reason) => {
				__.assertThat(reason, __.instanceOf(AssertionError));
				__.assertThat(reason.message, __.containsString('Deferred mismatch description'));
				done();
			}
		);

		deferred.resolve();
	});

	it('should pass diff representations to AssertionError', (done) => {
		const testMatcher = new TestMatcher(() => { return false; });
		testMatcher.getExpectedForDiff = () => {
			return 'expected for diff';
		};
		testMatcher.formatActualForDiff = function (actual) {
			return q('actual for diff: ' + actual);
		};

		__.promiseThat('actual value', testMatcher).done(
			() => {
				fail('Should not be fulfilled');
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
