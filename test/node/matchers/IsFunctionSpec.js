'use strict';

const __ = require('../../..');
const assertTrue = require('../asserts').assertTrue;
const assertFalse = require('../asserts').assertFalse;

describe('IsFunction', () => {

	describe('func', () => {
		let sut;
		beforeEach(() => {
			sut = __.func();
		});

		it('should match any func', () => {
			function namedFunction() {

			}
			assertTrue(sut.matches(() => {}));
			assertTrue(sut.matches(namedFunction));
			assertTrue(sut.matches(String));
			assertTrue(sut.matches(__.Description));
		});

		it('should not match non-funcs', () => {
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

				__.assertThat(description.get(), __.equalTo('a function'));
			});

			it('should contain non-func values', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
