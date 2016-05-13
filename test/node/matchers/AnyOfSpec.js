'use strict';

const assert = require('assert');

const __ = require('../../../lib/hamjest');

describe('AnyOf', () => {

	describe('anyOf', () => {
		let sut;
		beforeEach(() => {
			sut = __.anyOf('expected value', __.containsString('some'));
		});

		it('should match if any matcher matches', () => {
			assert.ok(sut.matches('expected value'));
			assert.ok(sut.matches('some value'));
		});

		it('should not match if no matcher matches', () => {
			assert.equal(sut.matches('different value'), false);
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should contain each matcher', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('("expected value" or a string containing "some")'));
			});

			it('should support null value', () => {

				__.anyOf(null, __.containsString('some')).describeTo(description);

				__.assertThat(description.get(), __.equalTo('(null or a string containing "some")'));
			});
		});
	});
});
