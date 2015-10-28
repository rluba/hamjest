'use strict';

var IsDate = require('../../lib/matchers/IsDate')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	;

describe('IsDate', function () {

	describe('date', function () {
		var date = IsDate.date;
		var sut;

		beforeEach(function () {
			sut = date();
		});

		it('should match any date', function () {
			assertTrue(sut.matches(new Date(2017, 14, 2)));
			assertTrue(sut.matches(new Date('2007-13-5')));
		});

		it('should not match non-dates', function () {
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

				__.assertThat(description.get(), __.equalTo('a date'));
			});

			it('should contain non-date values', function () {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
