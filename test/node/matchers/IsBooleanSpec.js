'use strict';

const assert = require('assert');

const __ = require('../../..');

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
			assert.ok(sut.matches(true));
			assert.ok(sut.matches(false));
		});

		it('should not match non-bools', () => {
			assert.equal(sut.matches(7), false);
			assert.equal(sut.matches({}), false);
			assert.equal(sut.matches('a string'), false);
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
