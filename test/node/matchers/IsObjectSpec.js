'use strict';

const assert = require('assert');

const __ = require('../../..');

describe('IsObject', () => {

	describe('object', () => {
		let sut;
		beforeEach(() => {
			sut = __.object();
		});

		it('should match any object', () => {
			assert.ok(sut.matches({}));
			assert.ok(sut.matches([]));
			assert.ok(sut.matches(new Date()));
			assert.ok(sut.matches(new __.Description()));
		});

		it('should not match non-objects', () => {
			assert.equal(sut.matches('a string'), false);
			assert.equal(sut.matches(5), false);
			assert.equal(sut.matches(true), false);
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
