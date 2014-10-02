'use strict';

var PromiseAllOf = require('../../lib/matchers/PromiseAllOf')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	, TestMatcher = require('../TestMatcher')
	, q = require('q')
	;

describe('PromiseAllOf', function () {

	describe('promiseAllOf', function () {
		var promiseAllOf = PromiseAllOf.promiseAllOf;

		it('should return a promise if any of the matchers returns a promise', function () {
			var sut = promiseAllOf(__.containsString('expected'), new TestMatcher(function () {
				return q(false);
			}));

			assertTrue(q.isPromise(sut.matches('expected value')));
		});

		it('should resolve to false if a matcher returns a promise resolving to false', function (done) {
			var sut = promiseAllOf(__.containsString('expected'), new TestMatcher(function () {
				return q(false);
			}));

			sut.matches('expected value').done(function (value) {
				assertFalse(value);
				done();
			});
		});

		it('should resolve to false if a matcher returns false', function (done) {
			var sut = promiseAllOf(__.containsString('expected'), new TestMatcher(function () {
				return q(true);
			}));

			sut.matches('other value').done(function (value) {
				assertFalse(value);
				done();
			});
		});

		it('should resolve to true if all matchers resolve to true', function (done) {
			var sut = promiseAllOf(__.containsString('expected'), new TestMatcher(function () {
				return q(true);
			}));

			sut.matches('expected value').done(function (value) {
				assertTrue(value);
				done();
			});
		});

		describe('description', function () {
			var sut;
			var description;

			beforeEach(function () {
				description = new Description();
				sut = promiseAllOf(__.containsString('expected'), __.containsString('value'));
			});

			it('should contain each matcher', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('(a string containing "expected" and a string containing "value")'));
			});

			it('should contain mismatch description of first mismatching matcher', function () {
				var actual = 'another value';

				return sut.describeMismatch(actual, description).then(function () {
					__.assertThat(description.get(), __.equalTo('a string containing "expected": was "another value"'));
				});
			});
		});
	});
});
