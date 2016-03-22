'use strict';

const assert = require('assert');

const __ = require('../../..');

describe('IsFunction', () => {

	describe('func', () => {
		let sut;
		beforeEach(() => {
			sut = __.func();
		});

		it('should match any func', () => {
			function namedFunction() {

			}
			assert.ok(sut.matches(() => {}));
			assert.ok(sut.matches(namedFunction));
			assert.ok(sut.matches(String));
			assert.ok(sut.matches(__.Description));
		});

		it('should not match non-funcs', () => {
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

				__.assertThat(description.get(), __.equalTo('a function'));
			});

			it('should contain non-func values', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
