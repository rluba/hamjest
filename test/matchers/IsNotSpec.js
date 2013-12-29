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
		var innerMatcher;

		beforeEach(function () {
			innerMatcher = __.containsString('expected');
		});

		it('should return a matcher', function () {

			var matcher = not(innerMatcher);

			assertTrue(__.isMatcher(matcher));
		});

		it('should delegate matching and invert result', function () {

			var matcher = not(innerMatcher);

			assertFalse(matcher.matches('expected value'));
			assertTrue(matcher.matches('another value'));
		});

		it('should wrap values in equalTo matchers', function () {

			var matcher = not({a: 'value'});

			assertFalse(matcher.matches({a: 'value'}));
			assertTrue(matcher.matches({another: 'value'}));
		});

		it('should expand on inner description', function () {
			var description = new Description();

			var matcher = not(innerMatcher);
			matcher.describeTo(description);

			__.assertThat(description.get(), __.equalTo('not a string containing "expected"'));
		});

		it('should delegate mismatch description', function () {
			var description = new Description();

			var matcher = not(innerMatcher);
			matcher.describeMismatch(7, description);

			__.assertThat(description.get(), __.equalTo('was a number (<7>)'));
		});
	});
});
