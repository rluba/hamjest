'use strict';

const __ = require('../../..');
const assertTrue = require('../asserts').assertTrue;
const assertFalse = require('../asserts').assertFalse;

describe('IsArrayWithItems', () => {

	describe('hasItems', () => {
		let sut;
		beforeEach(() => {
			sut = __.hasItems(__.containsString('expected'), 7);
		});

		it('should match if all matchers match', () => {
			assertTrue(sut.matches(['expected item', 'another item', 7]));
			assertTrue(sut.matches(['another item', 7, 'expected item']));
		});

		it('should not match if one matcher fails', () => {
			assertFalse(sut.matches(['expected', 6]));
			assertFalse(sut.matches(['another item', 7]));
		});

		it('should not match non-arrays', () => {
			assertFalse(sut.matches());
			assertFalse(sut.matches('not an array'));
			assertFalse(sut.matches({
				key: 'expected, but an object property',
				key2: 7
			}));
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should contain item description', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('an array containing a string containing "expected", <7>'));
			});

			it('should fit for empty arrays', () => {

				sut.describeMismatch([], description);

				__.assertThat(description.get(), __.equalTo('was empty'));
			});

			it('should contain every mismatch for mismatching matcher', () => {

				sut.describeMismatch(['expected', 6], description);

				__.assertThat(description.get(), __.containsString('<7>: [was "expected", was <6>]'));
			});

			it('should fit for non-arrays', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
