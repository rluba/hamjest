'use strict';

var q = require('q');
var AssertionError = require('assertion-error');
var __ = require('../..');
var fail = require('./asserts').fail;
var TestMatcher = require('./TestMatcher');
var _ = require('lodash');

describe('promiseThat', function () {

	it('should return promise', function () {

		var result = __.promiseThat('a value', new TestMatcher(function () { return true; }));

		__.assertThat(result, __.is(__.promise()));
	});

	it('should pass given value to matcher', function (done) {
		var passedValue;

		__.promiseThat('a value', new TestMatcher(function (value) {
			passedValue = value;
			return true;
		})).done(
			function () {
				__.assertThat(passedValue, __.is('a value'));
				done();
			},
			function () {
				fail('Should not be rejected');
			}
		);
	});

	it('should fulfill promise if matcher matches', function (done) {
		var input = 'expected value';

		__.promiseThat(input, __.is('expected value')).done(
			function () {
				done();
			},
			function () {
				fail('Should not be rejected');
			}
		);
	});

	it('should resolve if matcher returns promise resolving to true', function (done) {

		__.promiseThat('a value', new TestMatcher(function () {
			return q(true);
		})).done(
			function () {
				done();
			},
			function () {
				fail('Should not be rejected');
			}
		);
	});

	it('should reject promise with AssertionError if matcher resolves to false', function (done) {

		__.promiseThat('a value', new TestMatcher(function () {
			return q.resolve(false);
		})).done(
			function () {
				fail('Should not be fulfilled');
			},
			function (reason) {
				__.assertThat(reason, __.instanceOf(AssertionError));
				done();
			}
		);
	});

	it('should defer result until matcher promise resolves', function (done) {
		var deferred = q.defer();

		var result = __.promiseThat('a value', new TestMatcher(function () {
			return deferred;
		})).then(
			function () {
				done();
			},
			function () {
				fail('Should not be rejected');
			}
		);

		__.assertThat(result.isPending(), __.is(true));
		deferred.fulfill(true);
		result.done();
	});

	it('should allow a message as first parameter', function (done) {
		var message = 'Some explanation';

		__.promiseThat(message, 'different value', __.is('expected value')).done(
			function () {
				fail('Should not be fulfilled');
			},
			function (reason) {
				__.assertThat(reason, __.instanceOf(AssertionError));
				__.assertThat(reason.message, __.containsString(message));
				done();
			}
		);
	});

	it('should forward rejection if matcher returns rejecting promise', function (done) {
		var rejectingMatcher = new TestMatcher(function () {
			return q.reject('some reason');
		});

		__.promiseThat('a value', rejectingMatcher)
			.done(
				function () {
					fail('Should not be fulfilled');
				},
				function (reason) {
					__.assertThat(reason, __.is('some reason'));
					done();
				}
			);
	});

	it('should allow matchers to describe mismatch asynchronously', function (done) {
		var deferred = q.defer();
		var matcher = _.create(new __.Matcher(), {
			matches: function () {
				return false;
			},
			describeTo: function (description) {
				description.append('Matcher description');
			},
			describeMismatch: function (actual, description) {
				return deferred.promise.then(function () {
					description.append('Deferred mismatch description');
				});
			}
		});

		__.promiseThat('a value', matcher).done(
			function () {
				fail('Should not be fulfilled');
			},
			function (reason) {
				__.assertThat(reason, __.instanceOf(AssertionError));
				__.assertThat(reason.message, __.containsString('Deferred mismatch description'));
				done();
			}
		);

		deferred.resolve();
	});

	it('should pass diff representations to AssertionError', function (done) {
		var testMatcher = new TestMatcher(function () { return false; });
		testMatcher.getExpectedForDiff = function () {
			return 'expected for diff';
		};
		testMatcher.formatActualForDiff = function (actual) {
			return q('actual for diff: ' + actual);
		};

		__.promiseThat('actual value', testMatcher).done(
			function () {
				fail('Should not be fulfilled');
			},
			function (reason) {
				__.assertThat(reason, __.hasProperties({
					expected: 'expected for diff',
					actual: 'actual for diff: actual value'
				}));
				done();
			}
		);
	});
});
