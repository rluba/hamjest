'use strict';

const assert = require('assert');

const __ = require('../../..');

describe('IsRegExp', () => {

	describe('regExp', () => {
		let sut;

		beforeEach(() => {
			sut = __.regExp();
		});

		it('should match any regular expression', () => {
			assert.ok(sut.matches(/./));
			assert.ok(sut.matches(/a RegExp/i));
		});

		it('should not match non-RegExp values', () => {
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

				__.assertThat(description.get(), __.equalTo('a regular expression'));
			});

			it('should contain non-RegExp values', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
