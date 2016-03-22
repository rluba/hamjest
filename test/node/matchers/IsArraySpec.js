'use strict';

const __ = require('../../..');
const assertTrue = require('../asserts').assertTrue;
const assertFalse = require('../asserts').assertFalse;

describe('IsArray', () => {

	describe('array', () => {
		let sut;
		beforeEach(() => {
			sut = __.array();
		});

		it('should match any array', () => {
			assertTrue(sut.matches([]));
			assertTrue(sut.matches(['an element']));
		});

		it('should not match non-arrays', () => {
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

				__.assertThat(description.get(), __.equalTo('an array'));
			});

			it('should contain non-array values', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
