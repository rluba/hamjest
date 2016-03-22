'use strict';

const __ = require('../../..');
const assertTrue = require('../asserts').assertTrue;
const assertFalse = require('../asserts').assertFalse;

describe('IsDate', () => {

	describe('date', () => {
		let sut;
		beforeEach(() => {
			sut = __.date();
		});

		it('should match any date', () => {
			assertTrue(sut.matches(new Date(2017, 14, 2)));
			assertTrue(sut.matches(new Date('2007-13-5')));
		});

		it('should not match non-dates', () => {
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

				__.assertThat(description.get(), __.equalTo('a date'));
			});

			it('should contain non-date values', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
