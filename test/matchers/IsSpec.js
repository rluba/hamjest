'use strict';

var Is = require('../../lib/matchers/Is')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	;

describe('Is', function () {

	describe('is', function () {
		var is = Is.is;

		it('should delegate matching', function () {

			var matcher = is(__.containsString('expected'));

			assertTrue(matcher.matches('expected value'));
			assertFalse(matcher.matches('another value'));
		});

		it('should wrap values in equalTo matchers', function () {

			var matcher = is({a: 'value'});

			assertTrue(matcher.matches({a: 'value'}));
			assertFalse(matcher.matches({another: 'value'}));
		});

		it('should expand on inner description', function () {
			var description = new Description();

			var matcher = is(__.containsString('a value'));
			matcher.describeTo(description);

			__.assertThat(description.get(), __.equalTo('is a string containing "a value"'));
		});

		it('should delegate mismatch description', function () {
			var description = new Description();

			var matcher = is(__.containsString('a value'));
			matcher.describeMismatch(7, description);

			__.assertThat(description.get(), __.equalTo('was a Number (<7>)'));
		});
	});
});
