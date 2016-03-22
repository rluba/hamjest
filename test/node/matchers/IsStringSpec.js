'use strict';

const assert = require('assert');

const __ = require('../../..');

describe('IsString', () => {

	describe('string', () => {
		let sut;
		beforeEach(() => {
			sut = __.string();
		});

		it('should match any string', () => {
			assert.ok(sut.matches('a value'));
			assert.ok(sut.matches(String('another value')));
		});

		it('should not match non-strings', () => {
			assert.equal(sut.matches(7), false);
			assert.equal(sut.matches({}), false);
			assert.equal(sut.matches([]), false);
		});

		describe('description', () => {
			let description;

			beforeEach(() => {
				description = new __.Description();
			});

			it('should be nice', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a string'));
			});

			it('should contain non-string values', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
