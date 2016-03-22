'use strict';

const assert = require('assert');

const __ = require('../../..');

describe('IsDate', () => {

	describe('date', () => {
		let sut;
		beforeEach(() => {
			sut = __.date();
		});

		it('should match any date', () => {
			assert.ok(sut.matches(new Date(2017, 14, 2)));
			assert.ok(sut.matches(new Date('2007-13-5')));
		});

		it('should not match non-dates', () => {
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

				__.assertThat(description.get(), __.equalTo('a date'));
			});

			it('should contain non-date values', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
