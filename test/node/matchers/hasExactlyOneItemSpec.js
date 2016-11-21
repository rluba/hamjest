'use strict';

const assert = require('assert');

const __ = require('../../..');

describe('hasExactlyOneItem', () => {
	let sut;
	beforeEach(() => {
		sut = __.hasExactlyOneItem(__.containsString('expected'));
	});

	it('should match if exactly one item matches', () => {
		assert.ok(sut.matches(['expected item']));
		assert.ok(sut.matches(['an item', 7, 'expected item']));
		assert.ok(sut.matches(['an item', 'expected item', 'another item']));
	});

	it('should not match if no item matches', () => {
		assert.equal(sut.matches([]), false);
		assert.equal(sut.matches(['a string value', 7]), false);
	});

	it('should not match if more than one item matches', () => {
		assert.equal(sut.matches(['expected item', 'another expected item?']), false);
		assert.equal(sut.matches(['unrelated', 'expected item', 'other', 'another expected item?']), false);
	});

	it('should not match non-arrays', () => {
		assert.equal(sut.matches(), false);
		assert.equal(sut.matches('expected, but not an array'), false);
		assert.equal(sut.matches({key: 'expected, but an object property'}), false);
	});

	it('should wrap simple value in equalTo matcher', () => {
		sut = __.hasExactlyOneItem('expected item');

		assert.ok(sut.matches(['an item', 'expected item']));
		assert.equal(sut.matches(['an item', 'almost expected item']), false);
		assert.equal(sut.matches(['an item', 'expected item', 'expected item']), false);
	});

	describe('description', () => {
		let description;
		beforeEach(() => {
			description = new __.Description();
		});

		it('should contain item description', () => {

			sut.describeTo(description);

			__.assertThat(description.get(), __.equalTo('an array containing exactly one instance of a string containing "expected"'));
		});

		it('should fit for empty arrays', () => {

			sut.describeMismatch([], description);

			__.assertThat(description.get(), __.equalTo('was empty'));
		});

		it('should contain every match and mismatch, if both occur', () => {

			sut.describeMismatch(['unrelated', 'expected item', 7, 'another expected item?'], description);

			__.assertThat(description.get(), __.equalTo('array contained multiple instances:\n\titem 1: "expected item"\n\titem 3: "another expected item?"\nother items:\n\titem 0: was "unrelated"\n\titem 2: was a Number (<7>)'));
		});

		it('should contain every match, if there are no mismatches', () => {

			sut.describeMismatch(['expected item', 'another expected item?'], description);

			__.assertThat(description.get(), __.equalTo('array contained multiple instances:\n\titem 0: "expected item"\n\titem 1: "another expected item?"'));
		});

		it('should contain every mismatch, if no matches occur', () => {

			sut.describeMismatch(['unrelated', 7], description);

			__.assertThat(description.get(), __.equalTo('\n\titem 0: was "unrelated"\n\titem 1: was a Number (<7>)'));
		});

		it('should fit for non-arrays', () => {

			sut.describeMismatch({an: 'object'}, description);

			__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
		});
	});
});
