'use strict';

var AssertionError = require('assertion-error');
var __ = require('../../..');
var assertTrue = require('../asserts').assertTrue;
var assertFalse = require('../asserts').assertFalse;
var assertEquals = require('../asserts').assertEquals;

describe('SubstringMatcher', function () {

	describe('containsString', function () {
		var sut;
		beforeEach(function () {
			sut = __.containsString('a value');
		});

		it('should throw for non-string arguments', function () {
			__.assertThat(function () {
				__.containsString(7);
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

		it('should format actual for diff', function () {
			assertEquals('foo', sut.formatActualForDiff('foo'));
		});

		describe('description', function () {
			var description;
			beforeEach(function () {
				description = new __.Description();
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
		var sut;
		beforeEach(function () {
			sut = __.startsWith('a value');
		});

		it('should throw for non-string arguments', function () {
			__.assertThat(function () {
				__.startsWith(7);
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
				description = new __.Description();
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
		var sut;
		beforeEach(function () {
			sut = __.endsWith('a value');
		});

		it('should throw for non-string arguments', function () {
			__.assertThat(function () {
				__.endsWith(7);
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
				description = new __.Description();
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
