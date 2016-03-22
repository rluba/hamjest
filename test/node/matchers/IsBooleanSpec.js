'use strict';

const __ = require('../../..');
const assertTrue = require('../asserts').assertTrue;
const assertFalse = require('../asserts').assertFalse;

describe('IsBoolean', () => {

	describe('bool', () => {
		let sut;
		beforeEach(() => {
			sut = __.bool();
		});

		it('should be available as "boolean" too', () => {

			__.assertThat(__.boolean, __.is(__.bool));
		});

		it('should match any bool', () => {
			assertTrue(sut.matches(true));
			assertTrue(sut.matches(false));
		});

		it('should not match non-bools', () => {
			assertFalse(sut.matches(7));
			assertFalse(sut.matches({}));
			assertFalse(sut.matches('a string'));
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should be nice', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a boolean'));
			});

			it('should contain non-bool values', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
