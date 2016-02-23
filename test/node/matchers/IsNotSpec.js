'use strict';

var __ = require('../../..');
var assertTrue = require('../asserts').assertTrue;
var assertFalse = require('../asserts').assertFalse;

describe('IsNot', function () {

	describe('not', function () {
		var innerMatcher;
		beforeEach(function () {
			innerMatcher = __.containsString('expected');
		});

		it('should delegate matching and invert result', function () {

			var matcher = __.not(innerMatcher);

			assertFalse(matcher.matches('expected value'));
			assertTrue(matcher.matches('another value'));
		});

		it('should wrap values in equalTo matchers', function () {

			var matcher = __.not({a: 'value'});

			assertFalse(matcher.matches({a: 'value'}));
			assertTrue(matcher.matches({another: 'value'}));
		});

		it('should expand on inner description', function () {
			var description = new __.Description();

			var matcher = __.not(innerMatcher);
			matcher.describeTo(description);

			__.assertThat(description.get(), __.equalTo('not a string containing "expected"'));
		});

		it('should describe mismatching value', function () {
			var description = new __.Description();

			var matcher = __.not(__.hasProperties({foo: 'bar'}));
			matcher.describeMismatch({foo: 'bar'}, description);

			__.assertThat(description.get(), __.equalTo('was {"foo":"bar"}'));
		});
	});
});
