'use strict';

var AllOf = require('../../lib/matchers/AllOf')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	;

describe('AllOf', function () {

	describe('allOf', function () {
		var allOf = AllOf.allOf;
		var sut = allOf(__.containsString('expected'), __.containsString('value'));

		it('should return a matcher', function () {
			assertTrue(__.isMatcher(sut));
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

			it('should contain mismatch description of first mismatching matcher', function () {
				var actual = 'another value';

				sut.describeMismatch(actual, description);

				__.assertThat(description.get(), __.equalTo('a string containing "expected" was "another value"'));
			});
		});
	});
});
