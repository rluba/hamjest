'use strict';

const assert = require('assert');

const __ = require('../../..');

describe('IsArrayWithItem', () => {
	describe('hasItem', () => {
		let sut;
		beforeEach(() => {
			sut = __.hasItem(__.containsString('expected'));
		});

		it('should match if any item matches', () => {
			assert.ok(sut.matches(['expected item']));
			assert.ok(sut.matches(['an item', 7, 'expected item']));
			assert.ok(sut.matches(['an item', 'expected item', 'another item']));
		});

		it('should not match if no item matches', () => {
			assert.equal(sut.matches([]), false);
			assert.equal(sut.matches(['a string value', 7]), false);
		});

		it('should not match non-arrays', () => {
			assert.equal(sut.matches(), false);
			assert.equal(sut.matches('expected, but not an array'), false);
			assert.equal(sut.matches({key: 'expected, but an object property'}), false);
		});

		it('should wrap simple value in equalTo matcher', () => {
			sut = __.hasItem('expected item');

			assert.ok(sut.matches(['an item', 'expected item']));
			assert.equal(sut.matches(['an item', 'almost expected item']), false);
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

				__.assertThat(description.get(), __.equalTo('\nitem 0: was "a value"\nitem 1: was a Number (<7>)'));
			});

			it('should fit for non-arrays', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
