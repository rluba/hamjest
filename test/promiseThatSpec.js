'use strict';


var q = require('q')
	, AssertionError = require('assertion-error')
	, __ = require('../lib/hamjest')
	, promiseThat = require('../lib/promiseThat')
	, fail = require('./asserts').fail
	, TestMatcher = require('./TestMatcher')
	;

describe('promiseThat', function () {

	it('should return promise', function () {

		var result = promiseThat('a value', new TestMatcher(function () { return true; }));

		__.assertThat(result, __.is(__.promise()));
	});

	it('should pass given value to matcher', function (done) {
		var passedValue;

		promiseThat('a value', new TestMatcher(function (value) {
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

		promiseThat(input, __.is('expected value')).done(
			function () {
				done();
			},
			function () {
				fail('Should not be rejected');
			}
		);
	});

	it('should resolve if matcher returns promise resolving to true', function (done) {

		promiseThat('a value', new TestMatcher(function () {
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

		promiseThat('a value', new TestMatcher(function () {
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

		var result = promiseThat('a value', new TestMatcher(function () {
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

		promiseThat(message, 'different value', __.is('expected value')).done(
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

		promiseThat('a value', rejectingMatcher)
			.done(function () {
					fail('Should not be fulfilled');
				},
				function (reason) {
					__.assertThat(reason, __.is('some reason'));
					done();
				}
			);
	});
});
