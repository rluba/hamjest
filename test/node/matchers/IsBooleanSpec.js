'use strict';

var __ = require('../../..');
var assertTrue = require('../asserts').assertTrue;
var assertFalse = require('../asserts').assertFalse;

describe('IsBoolean', function () {

	describe('bool', function () {
		var sut;
		beforeEach(function () {
			sut = __.bool();
		});

		it('should match any bool', function () {
			assertTrue(sut.matches(true));
			assertTrue(sut.matches(false));
		});

		it('should not match non-bools', function () {
			assertFalse(sut.matches(7));
			assertFalse(sut.matches({}));
			assertFalse(sut.matches('a string'));
		});

		describe('description', function () {
			var description;
			beforeEach(function () {
				description = new __.Description();
			});

			it('should be nice', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a boolean'));
			});

			it('should contain non-bool values', function () {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
