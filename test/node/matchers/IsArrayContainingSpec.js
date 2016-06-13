'use strict';

const __ = require('../../..');

describe('IsArrayContaining', () => {

	describe('contains', () => {
		let sut;
		beforeEach(() => {
			sut = __.contains(__.containsString('expected'), 7);
		});

		it('should match if all matchers match in order', () => {
			__.assertThat(sut.matches(['expected item', 7]), __.is(true));
			__.assertThat(sut.matches([7, 'expected item']), __.is(false));
		});

		it('should not match if there are too many items', () => {
			__.assertThat(sut.matches(['expected', 7, 7]), __.is(false));
		});

		it('should not match if items are missing', () => {
			__.assertThat(sut.matches(['expected']), __.is(false));
			__.assertThat(sut.matches([]), __.is(false));
		});

		it('should not match non-arrays', () => {
			__.assertThat(sut.matches(), __.is(false));
			__.assertThat(sut.matches('not an array'), __.is(false));
			__.assertThat(sut.matches({
				key: 'expected, but an object property',
				key2: 7
			}), __.is(false));
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should contain item description', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('[a string containing "expected", <7>]'));
			});

			it('should contain all mismatches', () => {

				sut.describeMismatch([5, 6, 7], description);

				__.assertThat(description.get(), __.equalTo('item 0: was a Number (<5>)\nitem 1: was <6>\nnot matched:\n\t<7>'));
			});

			it('should contain surplus items', () => {

				sut.describeMismatch(['expected', 7, 'surplus 1', 100], description);

				__.assertThat(description.get(), __.equalTo('not matched:\n\t"surplus 1",\n\t<100>'));
			});

			it('should contain unmatched matchers', () => {

				sut.describeMismatch([], description);

				__.assertThat(description.get(), __.equalTo('missing:\n\ta string containing "expected",\n\t<7>'));
			});

			it('should fit for non-arrays', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
