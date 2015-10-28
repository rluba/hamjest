'use strict';

var IsBoolean = require('../../lib/matchers/IsBoolean')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	;

describe('IsBoolean', function () {

	describe('bool', function () {
		var bool = IsBoolean.bool;
		var sut;

		beforeEach(function () {
			sut = bool();
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
				description = new Description();
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
