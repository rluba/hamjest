'use strict';

const assert = require('assert');

const AssertionError = require('assertion-error');
const __ = require('../../..');

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
			assert.ok(sut.matches('a value'));
			assert.ok(sut.matches('containing a value'));
			assert.ok(sut.matches('a valueextension'));
		});

		it('should not match disjoint strings', () => {
			assert.equal(sut.matches('another value'), false);
			assert.equal(sut.matches(' value'), false);
		});

		it('should not match non-strings', () => {
			assert.equal(sut.matches(), false);
			assert.equal(sut.matches(5), false);
		});

		it('should provide expected for diff', () => {
			assert.equal('a value', sut.getExpectedForDiff());
		});

		it('should format actual for diff', () => {
			assert.equal('foo', sut.formatActualForDiff('foo'));
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

	describe('containsStrings', () => {
		let sut;
		beforeEach(() => {
			sut = __.containsStrings('a value', 'another value');
		});

		it('should throw for non-string arguments', () => {
			__.assertThat(() => {
				__.containsString(7);
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match superstrings', () => {
			assert.ok(sut.matches('another value and a value'));
			assert.ok(sut.matches('traa value and another valuestuff'));
		});

		it('should not match if one of the strings is missing', () => {
			assert.equal(sut.matches('another value'), false);
			assert.equal(sut.matches('a value'), false);
		});

		it('should not match non-strings', () => {
			assert.equal(sut.matches(), false);
			assert.equal(sut.matches(5), false);
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should contain values', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a string containing "a value", "another value"'));
			});

			it('should contain missing string and actual string', () => {

				sut.describeMismatch('some value and another value', description);

				__.assertThat(description.get(), __.equalTo('"a value" could not be found in "some value and another value"'));
			});

			it('should contain all missing strings and actual string', () => {

				sut.describeMismatch('some value', description);

				__.assertThat(description.get(), __.equalTo('"a value", "another value" could not be found in "some value"'));
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
			assert.ok(sut.matches('a value'));
			assert.ok(sut.matches('a valueextension'));
		});

		it('should not match other strings', () => {
			assert.equal(sut.matches('containing a value'), false);
			assert.equal(sut.matches('another value'), false);
			assert.equal(sut.matches(' value'), false);
		});

		it('should not match non-strings', () => {
			assert.equal(sut.matches(), false);
			assert.equal(sut.matches(5), false);
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
			assert.ok(sut.matches('a value'));
			assert.ok(sut.matches('containing a value'));
		});

		it('should not match other strings', () => {
			assert.equal(sut.matches('a valueextension'), false);
			assert.equal(sut.matches('another value'), false);
			assert.equal(sut.matches(' value'), false);
		});

		it('should not match non-strings', () => {
			assert.equal(sut.matches(), false);
			assert.equal(sut.matches(5), false);
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
