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

	it('should pass input promise to matcher', function (done) {
		var aPromise = q('promised value');
		var passedValue;

		promiseThat(aPromise, new TestMatcher(function (value) {
				passedValue = value;
				return true;
			}))
			.then(function () {
					__.assertThat(passedValue, __.equalTo(aPromise));
					done();
				},
				function () {
					fail('Should not be rejected');
				}
			)
			.done();
	});

	it('should pass simple value as promise to matcher', function (done) {
		var input = 'assertion value';
		var passedValue;

		promiseThat(input, new TestMatcher(function (value) {
				passedValue = value;
				return true;
			}))
			.then(function () {
					__.assertThat(passedValue, __.is(__.fulfilled(input)));
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

		promiseThat(input, __.fulfilled(__.equalTo(input)))
			.then(function () {
					done();
				},
				function () {
					fail('Should not be rejected');
				}
			)
			.done();
	});

	it('should reject promise if matcher fails', function (done) {
		var input = 'some value';

		promiseThat(input, __.fulfilled(__.equalTo('expected value')))
			.then(function () {
					fail('Should not be accepted');
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

		promiseThat(deferred.promise, __.fulfilled())
			.then(function () {
					done();
				},
				function () {
					fail('Should not be rejected');
				}
			)
			.done();

		deferred.fulfill();
	});

	it('should defer matching until promise is rejected', function (done) {
		var deferred = q.defer();

		promiseThat(deferred.promise, __.rejected())
			.then(function () {
					done();
				},
				function () {
					fail('Should not be rejected');
				}
			)
			.done();

		deferred.reject('a reason');
	});

	it('should allow a message as first parameter', function (done) {
		var message = 'Some explanation';

		promiseThat(message, q('promised value'), __.rejected())
			.then(function () {
					fail('Should not be rejected');
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
