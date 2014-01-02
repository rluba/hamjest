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

	it('should pass fulfilled value to matcher', function (done) {
		var aPromise = q('promised value');
		var passedValue;

		promiseThat(aPromise, new TestMatcher(function (value) {
				passedValue = value;
				return true;
			}))
			.then(function () {
					__.assertThat(passedValue, __.equalTo('promised value'));
					done();
				},
				function () {
					fail('Should not be rejected');
				}
			)
			.done();
	});

	it('should also accept simple values instead of promises', function (done) {
		var input = 'assertion value';
		var passedValue;

		promiseThat(input, new TestMatcher(function (value) {
				passedValue = value;
				return true;
			}))
			.then(function () {
					__.assertThat(passedValue, __.equalTo(input));
					done();
				},
				function () {
					fail('Should not be rejected');
				}
			)
			.done();
	});

	it('should fulfill promise if matcher matches', function (done) {
		var input = 'expected value';

		promiseThat(input, __.equalTo(input))
			.then(function () {
					done();
				},
				function () {
					fail('Should not be rejected');
				}
			)
			.done();
	});

	it('should reject promise with AssertionError if matcher fails', function (done) {
		var input = 'some value';

		promiseThat(input, __.equalTo('expected value'))
			.then(function () {
					fail('Should not be fulfilled');
				},
				function (reason) {
					__.assertThat(reason, __.instanceOf(AssertionError));
					done();
				}
			)
			.done();
	});

	it('should defer matching until promise is fulfilled', function (done) {
		var deferred = q.defer();

		promiseThat(deferred.promise, __.equalTo('expected'))
			.then(function () {
					done();
				},
				function () {
					fail('Should not be rejected');
				}
			)
			.done();

		deferred.fulfill('expected');
	});

	it('should reject promise if input is rejected', function (done) {
		var deferred = q.defer();

		promiseThat(deferred.promise, __.anything())
			.then(function () {
					fail('Should not be fulfilled');
				},
				function () {
					done();
				}
			)
			.done();

		deferred.reject('a reason');
	});

	it('should allow a message as first parameter', function (done) {
		var message = 'Some explanation';

		promiseThat(message, q('different value'), __.equalTo('expected value'))
			.then(function () {
					fail('Should not be fulfilled');
				},
				function (reason) {
					__.assertThat(reason, __.instanceOf(AssertionError));
					__.assertThat(reason.message, __.containsString(message));
					done();
				}
			)
			.done();
	});
});
