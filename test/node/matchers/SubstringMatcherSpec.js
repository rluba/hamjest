'use strict';

const AssertionError = require('assertion-error');
const __ = require('../../..');
const assertTrue = require('../asserts').assertTrue;
const assertFalse = require('../asserts').assertFalse;
const assertEquals = require('../asserts').assertEquals;

describe('SubstringMatcher', () => {

	describe('containsString', () => {
		let sut;
		beforeEach(() => {
			sut = __.containsString('a value');
		});

		it('should throw for non-string arguments', () => {
			__.assertThat(() => {
				__.containsString(7);
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match superstrings', () => {
			assertTrue(sut.matches('a value'));
			assertTrue(sut.matches('containing a value'));
			assertTrue(sut.matches('a valueextension'));
		});

		it('should not match disjoint strings', () => {
			assertFalse(sut.matches('another value'));
			assertFalse(sut.matches(' value'));
		});

		it('should not match non-strings', () => {
			assertFalse(sut.matches());
			assertFalse(sut.matches(5));
		});

		it('should provide expected for diff', () => {
			assertEquals('a value', sut.getExpectedForDiff());
		});

		it('should format actual for diff', () => {
			assertEquals('foo', sut.formatActualForDiff('foo'));
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should contain value', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a string containing "a value"'));
			});

			it('should contain mismatched string', () => {

				sut.describeMismatch('another value', description);

				__.assertThat(description.get(), __.equalTo('was "another value"'));
			});

			it('should contain non-string values', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});

	describe('startsWith', () => {
		let sut;
		beforeEach(() => {
			sut = __.startsWith('a value');
		});

		it('should throw for non-string arguments', () => {
			__.assertThat(() => {
				__.startsWith(7);
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match strings starting with...', () => {
			assertTrue(sut.matches('a value'));
			assertTrue(sut.matches('a valueextension'));
		});

		it('should not match other strings', () => {
			assertFalse(sut.matches('containing a value'));
			assertFalse(sut.matches('another value'));
			assertFalse(sut.matches(' value'));
		});

		it('should not match non-strings', () => {
			assertFalse(sut.matches());
			assertFalse(sut.matches(5));
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should describe as value', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a string starting with "a value"'));
			});

			it('should describe mismatched string', () => {

				sut.describeMismatch('another value', description);

				__.assertThat(description.get(), __.equalTo('was "another value"'));
			});

			it('should describe non-string values', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});

	describe('endsWith', () => {
		let sut;
		beforeEach(() => {
			sut = __.endsWith('a value');
		});

		it('should throw for non-string arguments', () => {
			__.assertThat(() => {
				__.endsWith(7);
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match strings ending with...', () => {
			assertTrue(sut.matches('a value'));
			assertTrue(sut.matches('containing a value'));
		});

		it('should not match other strings', () => {
			assertFalse(sut.matches('a valueextension'));
			assertFalse(sut.matches('another value'));
			assertFalse(sut.matches(' value'));
		});

		it('should not match non-strings', () => {
			assertFalse(sut.matches());
			assertFalse(sut.matches(5));
		});

		describe('description', () => {
			let description;

			beforeEach(() => {
				description = new __.Description();
			});

			it('should describe as value', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a string ending with "a value"'));
			});

			it('should describe mismatched string', () => {

				sut.describeMismatch('another value', description);

				__.assertThat(description.get(), __.equalTo('was "another value"'));
			});

			it('should describe non-string values', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
