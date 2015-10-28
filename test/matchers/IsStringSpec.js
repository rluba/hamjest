'use strict';

var IsString = require('../../lib/matchers/IsString')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	;

describe('IsString', function () {

	describe('string', function () {
		var string = IsString.string;
		var sut;

		beforeEach(function () {
			sut = string();
		});

		it('should match any string', function () {
			assertTrue(sut.matches('a value'));
			assertTrue(sut.matches(String('another value')));
		});

		it('should not match non-strings', function () {
			assertFalse(sut.matches(7));
			assertFalse(sut.matches({}));
			assertFalse(sut.matches([]));
		});

		describe('description', function () {
			var description;

			beforeEach(function () {
				description = new Description();
			});

			it('should be nice', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a string'));
			});

			it('should contain non-string values', function () {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
