'use strict';

var _ = require('lodash-node')
	, SubstringMatcher = require('../../lib/matchers/SubstringMatcher')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	, assertEquals = require('../asserts').assertEquals
	;

describe('SubstringMatcher', function () {

	describe('containsString', function () {
		var containsString = SubstringMatcher.containsString;

		it('should return a matcher', function () {

			var matcher = containsString('a string');

			assertTrue(__.isMatcher(matcher));
		});

		it('should match superstrings', function () {

			var matcher = containsString('a string');

			assertTrue(matcher.matches('a string'));
			assertTrue(matcher.matches('containing a string'));
			assertTrue(matcher.matches('a stringextension'));
		});

		it('should not match disjoint strings', function () {

			var matcher = containsString('a string');

			assertFalse(matcher.matches('another string'));
			assertFalse(matcher.matches(' string'));
		});

		it('should not match non-strings', function () {

			var matcher = containsString('a string');

			assertFalse(matcher.matches());
			assertFalse(matcher.matches(5));
		});

		describe('description', function () {
			var description;
			var matcher;

			beforeEach(function () {
				description = new Description();
				matcher = containsString('a value');
			});

			it('should describe as value', function () {
				var description = new Description();
				var matcher = containsString('a value');

				matcher.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a string containing "a value"'));
			});

			it('should describe mismatched string', function () {
				var description = new Description();

				matcher.describeMismatch('another string', description);

				__.assertThat(description.get(), __.equalTo('was "another string"'));
			});

			it('should describe non-string values', function () {
				var description = new Description();

				matcher.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a object ({"an":"object"})'));
			});
		});
	});
});
