'use strict';

const assert = require('assert');

const __ = require('../../..');

describe('IsNumber', () => {

	describe('number', () => {
		let sut;
		beforeEach(() => {
			sut = __.number();
		});

		it('should match any number', () => {
			assert.ok(sut.matches(7));
			assert.ok(sut.matches(7.7));
		});

		it('should not match non-numbers', () => {
			assert.equal(sut.matches({}), false);
			assert.equal(sut.matches([]), false);
			assert.equal(sut.matches('a string'), false);
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
