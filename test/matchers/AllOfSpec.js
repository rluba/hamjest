'use strict';

var q = require('q');
var AllOf = require('../../lib/matchers/AllOf')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	;
var deferMatcher = require('../deferMatcher');

describe('AllOf', function () {

	describe('allOf', function () {
		var allOf = AllOf.allOf;
		var sut;
		beforeEach(function () {
			sut = allOf(__.containsString('expected'), __.containsString('value'));
		});

		it('should match if every matcher matches', function () {
			assertTrue(sut.matches('expected value'));
			assertTrue(sut.matches('value expected'));
		});

		it('should not match if one matcher does not match', function () {
			assertFalse(sut.matches('expected valu'));
			assertFalse(sut.matches('expecte value'));
		});

		describe('description', function () {
			var description;

			beforeEach(function () {
				description = new Description();
			});

			it('should contain each matcher', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('(a string containing "expected" and a string containing "value")'));
			});

			it('should contain mismatch description of all mismatching matchers', function () {
				var actual = 'another val';

				sut.describeMismatch(actual, description);

				__.assertThat(description.get(), __.equalTo('a string containing "expected": was "another val"\na string containing "value": was "another val"'));
			});
		});

		describe('with a promising matcher', function () {
			beforeEach(function () {
				sut = allOf(__.containsString('expected'), deferMatcher(__.containsString('value')));
			});

			it('should return a promise if any of the matchers returns a promise', function () {

				assertTrue(q.isPromise(sut.matches('expected value')));
			});

			it('should resolve to false if a matcher returns a promise resolving to false', function () {

				return sut.matches('expected valu').then(function (value) {
					assertFalse(value);
				});
			});

			it('should resolve to false if a matcher returns false', function () {

				return sut.matches('other value').then(function (value) {
					assertFalse(value);
				});
			});

			it('should resolve to true if all matchers resolve to true', function () {

				return sut.matches('expected value').then(function (value) {
					assertTrue(value);
				});
			});

			describe('description', function () {
				var description;

				beforeEach(function () {
					description = new Description();
				});

				it('should return promise if one of the matchers returns a promise', function () {
					var sut = allOf(__.containsString('expected'), deferMatcher(__.containsString('value')));
					var actual = 'another valu';

					return sut.describeMismatch(actual, description).then(function () {
						__.assertThat(description.get(), __.equalTo('a string containing "expected": was "another valu"\ndeferred: a string containing "value": deferred: was "another valu"'));
					});
				});
			});
		});
	});
});
