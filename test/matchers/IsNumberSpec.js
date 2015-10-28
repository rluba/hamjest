'use strict';

var IsNumber = require('../../lib/matchers/IsNumber')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	;

describe('IsNumber', function () {

	describe('number', function () {
		var number = IsNumber.number;
		var sut;

		beforeEach(function () {
			sut = number();
		});

		it('should match any number', function () {
			assertTrue(sut.matches(7));
			assertTrue(sut.matches(7.7));
		});

		it('should not match non-numbers', function () {
			assertFalse(sut.matches({}));
			assertFalse(sut.matches([]));
			assertFalse(sut.matches('a string'));
		});

		describe('description', function () {
			var description;

			beforeEach(function () {
				description = new Description();
			});

			it('should be nice', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a number'));
			});

			it('should contain non-number values', function () {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
