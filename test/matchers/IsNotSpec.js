'use strict';

var IsNot = require('../../lib/matchers/IsNot')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	;

describe('IsNot', function () {

	describe('not', function () {
		var not = IsNot.not;

		it('should return a matcher', function () {

			var matcher = not(__.equalTo('a value'));

			assertTrue(__.isMatcher(matcher));
		});

		it('should delegate matching and invert result', function () {

			var matcher = not(__.containsString('expected'));

			assertFalse(matcher.matches('expected value'));
			assertTrue(matcher.matches('another value'));
		});

		it('should wrap values in equalTo matchers', function () {

			var matcher = not({a: "value"});

			assertFalse(matcher.matches({a: "value"}));
			assertTrue(matcher.matches({another: "value"}));
		});

		it('should expand on inner description', function () {
			var description = new Description();

			var matcher = not(__.containsString('a value'));
			matcher.describeTo(description);

			__.assertThat(description.get(), __.equalTo('not a string containing "a value"'));
		});

		it('should delegate mismatch description', function () {
			var description = new Description();

			var matcher = not(__.containsString('a value'));
			matcher.describeMismatch(7, description);

			__.assertThat(description.get(), __.equalTo('was a number (<7>)'));
		});
	});
});
