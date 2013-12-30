'use strict';

var AnyOf = require('../../lib/matchers/AnyOf')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	;

describe('AnyOf', function () {

	describe('anyOf', function () {
		var anyOf = AnyOf.anyOf;
		var sut = anyOf(__.containsString('expected value'), __.containsString('some value'));

		it('should match if any matcher matches', function () {
			assertTrue(sut.matches('expected value'));
			assertTrue(sut.matches('some value'));
		});

		it('should not match if no matcher matches', function () {
			assertFalse(sut.matches('different value'));
		});

		describe('description', function () {
			var description;

			beforeEach(function () {
				description = new Description();
			});

			it('should contain each matcher', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('(a string containing "expected value" or a string containing "some value")'));
			});
		});
	});
});
