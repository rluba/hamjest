'use strict';

const assert = require('assert');

const __ = require('../../..');

describe('IsArray', () => {

	describe('array', () => {
		let sut;
		beforeEach(() => {
			sut = __.array();
		});

		it('should match any array', () => {
			assert.ok(sut.matches([]));
			assert.ok(sut.matches(['an element']));
		});

		it('should not match non-arrays', () => {
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

				__.assertThat(description.get(), __.equalTo('an array'));
			});

			it('should contain non-array values', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
