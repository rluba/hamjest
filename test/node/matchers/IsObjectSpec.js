'use strict';

var __ = require('../../..');
var assertTrue = require('../asserts').assertTrue;
var assertFalse = require('../asserts').assertFalse;

describe('IsObject', function () {

	describe('object', function () {
		var sut;
		beforeEach(function () {
			sut = __.object();
		});

		it('should match any object', function () {
			assertTrue(sut.matches({}));
			assertTrue(sut.matches([]));
			assertTrue(sut.matches(new Date()));
			assertTrue(sut.matches(new __.Description()));
		});

		it('should not match non-objects', function () {
			assertFalse(sut.matches('a string'));
			assertFalse(sut.matches(5));
			assertFalse(sut.matches(true));
		});

		describe('description', function () {
			var description;
			beforeEach(function () {
				description = new __.Description();
			});

			it('should be nice', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('an object'));
			});

			it('should contain non-object values', function () {

				sut.describeMismatch('a string value', description);

				__.assertThat(description.get(), __.equalTo('was a String ("a string value")'));
			});
		});
	});
});
