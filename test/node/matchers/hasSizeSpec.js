'use strict';

const __ = require('../../..');

describe('hasSize', () => {
	let sut;
	beforeEach(() => {
		sut = __.hasSize(__.greaterThan(2));
	});

	it('should match arrays', () => {
		__.assertThat(sut.matches(['a', 'b', 'c']), __.is(true));
		__.assertThat(sut.matches(['a', 'c']), __.is(false));
		__.assertThat(sut.matches([]), __.is(false));
	});

	it('should match objects', () => {
		__.assertThat(sut.matches({a: '1', b: 2, c: '3'}), __.is(true));
		__.assertThat(sut.matches({a: '1', b: 2}), __.is(false));
		__.assertThat(sut.matches({}), __.is(false));
	});

	it('should match strings', () => {
		__.assertThat(sut.matches('a long string'), __.is(true));
		__.assertThat(sut.matches('xs'), __.is(false));
	});

	it('should not match other types', () => {
		__.assertThat(sut.matches(12), __.is(false));
		__.assertThat(sut.matches(new Date()), __.is(false));
	});

	it('should wrap simple value in equalTo matcher', () => {
		sut = __.hasSize(2);

		__.assertThat(sut.matches(['a', 'b', 'c']), __.is(false));
		__.assertThat(sut.matches(['a', 'c']), __.is(true));
		__.assertThat(sut.matches([]), __.is(false));
	});

	describe('description', () => {
		let description;
		beforeEach(() => {
			description = new __.Description();
		});

		it('should contain matcher description', () => {

			sut.describeTo(description);

			__.assertThat(description.get(), __.equalTo('a collection or string with size a number greater than <2>'));
		});

		it('should contain mismatched value and size', () => {

			sut.describeMismatch(['a'], description);

			__.assertThat(description.get(), __.equalTo('size was <1>\nfor ["a"]'));
		});

		it('should fit for non-arrays', () => {

			sut.describeMismatch(7, description);

			__.assertThat(description.get(), __.equalTo('was a Number (<7>)'));
		});
	});
});
