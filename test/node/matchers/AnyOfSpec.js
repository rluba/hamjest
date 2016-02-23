'use strict';

var __ = require('../../../lib/hamjest');
var assertTrue = require('../asserts').assertTrue;
var assertFalse = require('../asserts').assertFalse;

describe('AnyOf', function () {

	describe('anyOf', function () {
		var sut;
		beforeEach(function () {
			sut = __.anyOf('expected value', __.containsString('some'));
		});

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
				description = new __.Description();
			});

			it('should contain each matcher', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('("expected value" or a string containing "some")'));
			});
		});
	});
});
