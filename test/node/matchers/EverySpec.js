'use strict';

const __ = require('../../..');

describe('Every', () => {

	describe('everyItem', () => {
		let sut;
		beforeEach(() => {
			sut = __.everyItem(__.string());
		});

		it('should match arrays', () => {
			__.assertThat(sut.matches([]), __.is(true));
			__.assertThat(sut.matches(['a', 'b']), __.is(true));

			__.assertThat(sut.matches(['a', 1]), __.is(false));
			__.assertThat(sut.matches([1, 'a']), __.is(false));
		});

		it('should match objects', () => {
			__.assertThat(sut.matches({}), __.is(true));
			__.assertThat(sut.matches({a: '1', b: '2'}), __.is(true));

			__.assertThat(sut.matches({a: '1', b: 2}), __.is(false));
			__.assertThat(sut.matches({a: 1, b: '2'}), __.is(false));
		});

		it('should not match other types', () => {
			__.assertThat(sut.matches('a'), __.is(false));
			__.assertThat(sut.matches(12), __.is(false));
		});

		it('should wrap simple value in equalTo matcher', () => {
			sut = __.everyItem('a');

			__.assertThat(sut.matches([]), __.is(true));
			__.assertThat(sut.matches(['a', 'a']), __.is(true));
			__.assertThat(sut.matches(['a', 'c']), __.is(false));
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should contain matcher description', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('every item is a string'));
			});

			it('should contain mismatched values', () => {

				sut.describeMismatch([1, 'a', 2], description);

				__.assertThat(description.get(), __.equalTo('\nitem <0> was a Number (<1>)\nitem <2> was a Number (<2>)'));
			});

			it('should contain mismatched values', () => {

				sut.describeMismatch({x: 'a', y: 2}, description);

				__.assertThat(description.get(), __.equalTo('\nitem "y" was a Number (<2>)'));
			});

			it('should fit for non-arrays', () => {

				sut.describeMismatch(7, description);

				__.assertThat(description.get(), __.equalTo('was a Number (<7>)'));
			});
		});
	});
});
