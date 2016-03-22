'use strict';

const __ = require('../../..');
const assertTrue = require('../asserts').assertTrue;
const assertFalse = require('../asserts').assertFalse;

describe('IsNumber', () => {

	describe('number', () => {
		let sut;
		beforeEach(() => {
			sut = __.number();
		});

		it('should match any number', () => {
			assertTrue(sut.matches(7));
			assertTrue(sut.matches(7.7));
		});

		it('should not match non-numbers', () => {
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

				__.assertThat(description.get(), __.equalTo('a number'));
			});

			it('should contain non-number values', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
