'use strict';

var AssertionError = require('assertion-error')
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
		var sut;

		beforeEach(function () {
			sut = containsString('a value');
		});

		it('should throw for non-string arguments', function () {
			__.assertThat(function () {
				containsString(7);
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match superstrings', function () {
			assertTrue(sut.matches('a value'));
			assertTrue(sut.matches('containing a value'));
			assertTrue(sut.matches('a valueextension'));
		});

		it('should not match disjoint strings', function () {
			assertFalse(sut.matches('another value'));
			assertFalse(sut.matches(' value'));
		});

		it('should not match non-strings', function () {
			assertFalse(sut.matches());
			assertFalse(sut.matches(5));
		});

		it('should provide expected for diff', function () {
			assertEquals('a value', sut.getExpectedForDiff());
		});

		it('should format actual for diff', function() {
			assertEquals('foo', sut.formatActualForDiff('foo'));
		});

		describe('description', function () {
			var description;

			beforeEach(function () {
				description = new Description();
			});

			it('should contain value', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a string containing "a value"'));
			});

			it('should contain mismatched string', function () {

				sut.describeMismatch('another value', description);

				__.assertThat(description.get(), __.equalTo('was "another value"'));
			});

			it('should contain non-string values', function () {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});

	describe('startsWith', function () {
		var startsWith = SubstringMatcher.startsWith;
		var sut;

		beforeEach(function () {
			sut = startsWith('a value');
		});

		it('should throw for non-string arguments', function () {
			__.assertThat(function () {
				startsWith(7);
			}, __.throws(__.instanceOf(AssertionError)));
		});


		it('should match strings starting with...', function () {
			assertTrue(sut.matches('a value'));
			assertTrue(sut.matches('a valueextension'));
		});

		it('should not match other strings', function () {
			assertFalse(sut.matches('containing a value'));
			assertFalse(sut.matches('another value'));
			assertFalse(sut.matches(' value'));
		});

		it('should not match non-strings', function () {
			assertFalse(sut.matches());
			assertFalse(sut.matches(5));
		});

		describe('description', function () {
			var description;

			beforeEach(function () {
				description = new Description();
			});

			it('should describe as value', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a string starting with "a value"'));
			});

			it('should describe mismatched string', function () {

				sut.describeMismatch('another value', description);

				__.assertThat(description.get(), __.equalTo('was "another value"'));
			});

			it('should describe non-string values', function () {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});

	describe('endsWith', function () {
		var endsWith = SubstringMatcher.endsWith;
		var sut;

		beforeEach(function () {
			sut = endsWith('a value');
		});

		it('should throw for non-string arguments', function () {
			__.assertThat(function () {
				endsWith(7);
			}, __.throws(__.instanceOf(AssertionError)));
		});


		it('should match strings ending with...', function () {
			assertTrue(sut.matches('a value'));
			assertTrue(sut.matches('containing a value'));
		});

		it('should not match other strings', function () {
			assertFalse(sut.matches('a valueextension'));
			assertFalse(sut.matches('another value'));
			assertFalse(sut.matches(' value'));
		});

		it('should not match non-strings', function () {
			assertFalse(sut.matches());
			assertFalse(sut.matches(5));
		});

		describe('description', function () {
			var description;

			beforeEach(function () {
				description = new Description();
			});

			it('should describe as value', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a string ending with "a value"'));
			});

			it('should describe mismatched string', function () {

				sut.describeMismatch('another value', description);

				__.assertThat(description.get(), __.equalTo('was "another value"'));
			});

			it('should describe non-string values', function () {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
