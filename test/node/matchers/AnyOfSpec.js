'use strict';

const __ = require('../../../lib/hamjest');
const assertTrue = require('../asserts').assertTrue;
const assertFalse = require('../asserts').assertFalse;

describe('AnyOf', () => {

	describe('anyOf', () => {
		let sut;
		beforeEach(() => {
			sut = __.anyOf('expected value', __.containsString('some'));
		});

		it('should match if any matcher matches', () => {
			assertTrue(sut.matches('expected value'));
			assertTrue(sut.matches('some value'));
		});

		it('should not match if no matcher matches', () => {
			assertFalse(sut.matches('different value'));
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
		});
	});
});
