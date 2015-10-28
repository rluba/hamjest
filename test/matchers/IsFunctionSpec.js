'use strict';

var IsFunction = require('../../lib/matchers/IsFunction')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	;

describe('IsFunction', function () {

	describe('func', function () {
		var func = IsFunction.func;
		var sut;

		beforeEach(function () {
			sut = func();
		});

		it('should match any func', function () {
			function namedFunction() {

			}
			assertTrue(sut.matches(function () {}));
			assertTrue(sut.matches(namedFunction));
			assertTrue(sut.matches(String));
			assertTrue(sut.matches(Description));
		});

		it('should not match non-funcs', function () {
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

				__.assertThat(description.get(), __.equalTo('a function'));
			});

			it('should contain non-func values', function () {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
