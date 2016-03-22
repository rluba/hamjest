'use strict';

var __ = require('../../..');
var assertTrue = require('../asserts').assertTrue;
var assertFalse = require('../asserts').assertFalse;

describe('Is', function () {

	describe('is', function () {
		it('should delegate matching', function () {

			var matcher = __.is(__.containsString('expected'));

			assertTrue(matcher.matches('expected value'));
			assertFalse(matcher.matches('another value'));
		});

		it('should wrap values in equalTo matchers', function () {

			var matcher = __.is({a: 'value'});

			assertTrue(matcher.matches({a: 'value'}));
			assertFalse(matcher.matches({another: 'value'}));
		});

		it('should expand on inner description', function () {
			var description = new __.Description();

			var matcher = __.is(__.containsString('a value'));
			matcher.describeTo(description);

			__.assertThat(description.get(), __.equalTo('is a string containing "a value"'));
		});

		it('should delegate mismatch description', function () {
			var description = new __.Description();

			var matcher = __.is(__.containsString('a value'));
			matcher.describeMismatch(7, description);

			__.assertThat(description.get(), __.equalTo('was a Number (<7>)'));
		});
	});
});
