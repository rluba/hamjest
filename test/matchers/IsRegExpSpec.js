'use strict';

var IsRegExp = require('../../lib/matchers/IsRegExp')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	;

describe('IsRegExp', function () {

	describe('regExp', function () {
		var regExp = IsRegExp.regExp;
		var sut;

		beforeEach(function () {
			sut = regExp();
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
				description = new Description();
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
