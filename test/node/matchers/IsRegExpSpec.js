'use strict';

const __ = require('../../..');
const assertTrue = require('../asserts').assertTrue;
const assertFalse = require('../asserts').assertFalse;

describe('IsRegExp', () => {

	describe('regExp', () => {
		let sut;

		beforeEach(() => {
			sut = __.regExp();
		});

		it('should match any regular expression', () => {
			assertTrue(sut.matches(/./));
			assertTrue(sut.matches(/a RegExp/i));
		});

		it('should not match non-RegExp values', () => {
			assertFalse(sut.matches({}));
			assertFalse(sut.matches([]));
			assertFalse(sut.matches('a string'));
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should be nice', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a regular expression'));
			});

			it('should contain non-RegExp values', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
