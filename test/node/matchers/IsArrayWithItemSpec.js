'use strict';

const __ = require('../../..');
const assertTrue = require('../asserts').assertTrue;
const assertFalse = require('../asserts').assertFalse;

describe('IsArrayWithItem', () => {
	describe('hasItem', () => {
		let sut;
		beforeEach(() => {
			sut = __.hasItem(__.containsString('expected'));
		});

		it('should match if any item matches', () => {
			assertTrue(sut.matches(['expected item']));
			assertTrue(sut.matches(['an item', 7, 'expected item']));
			assertTrue(sut.matches(['an item', 'expected item', 'another item']));
		});

		it('should not match if no item matches', () => {
			assertFalse(sut.matches([]));
			assertFalse(sut.matches(['a string value', 7]));
		});

		it('should not match non-arrays', () => {
			assertFalse(sut.matches());
			assertFalse(sut.matches('expected, but not an array'));
			assertFalse(sut.matches({key: 'expected, but an object property'}));
		});

		it('should wrap simple value in equalTo matcher', () => {
			sut = __.hasItem('expected item');

			assertTrue(sut.matches(['an item', 'expected item']));
			assertFalse(sut.matches(['an item', 'almost expected item']));
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should contain item description', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('an array containing a string containing "expected"'));
			});

			it('should fit for empty arrays', () => {

				sut.describeMismatch([], description);

				__.assertThat(description.get(), __.equalTo('was empty'));
			});

			it('should contain every mismatch', () => {

				sut.describeMismatch(['a value', 7], description);

				__.assertThat(description.get(), __.equalTo('[was "a value", was a Number (<7>)]'));
			});

			it('should fit for non-arrays', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
