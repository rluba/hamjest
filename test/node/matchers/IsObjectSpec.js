'use strict';

const __ = require('../../..');
const assertTrue = require('../asserts').assertTrue;
const assertFalse = require('../asserts').assertFalse;

describe('IsObject', () => {

	describe('object', () => {
		let sut;
		beforeEach(() => {
			sut = __.object();
		});

		it('should match any object', () => {
			assertTrue(sut.matches({}));
			assertTrue(sut.matches([]));
			assertTrue(sut.matches(new Date()));
			assertTrue(sut.matches(new __.Description()));
		});

		it('should not match non-objects', () => {
			assertFalse(sut.matches('a string'));
			assertFalse(sut.matches(5));
			assertFalse(sut.matches(true));
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should be nice', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('an object'));
			});

			it('should contain non-object values', () => {

				sut.describeMismatch('a string value', description);

				__.assertThat(description.get(), __.equalTo('was a String ("a string value")'));
			});
		});
	});
});
