'use strict';

var __ = require('../../..');
var assertTrue = require('../asserts').assertTrue;
var assertFalse = require('../asserts').assertFalse;

describe('IsRegExp', function () {

	describe('regExp', function () {
		var sut;

		beforeEach(function () {
			sut = __.regExp();
		});

		it('should match any regular expression', function () {
			assertTrue(sut.matches(/./));
			assertTrue(sut.matches(/a RegExp/i));
		});

		it('should not match non-RegExp values', function () {
			assertFalse(sut.matches({}));
			assertFalse(sut.matches([]));
			assertFalse(sut.matches('a string'));
		});

		describe('description', function () {
			var description;
			beforeEach(function () {
				description = new __.Description();
			});

			it('should be nice', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a regular expression'));
			});

			it('should contain non-RegExp values', function () {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
