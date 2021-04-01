'use strict';

const __ = require('../../..');

describe('IsArrayContainingInAnyOrder', () => {

	describe('containsInAnyOrder', () => {
		let sut;
		beforeEach(() => {
			sut = __.containsInAnyOrder(__.containsString('expected'), __.containsString('item'), 7);
		});

		it('should match if all matchers match an item', () => {
			__.assertThat(sut.matches(['expected', 'an item', 7]), __.is(true));
			__.assertThat(sut.matches(['an item', 7, 'expected']), __.is(true));
		});

		it('should not match if there is no 1:1 relation between items and matchers', () => {
			__.assertThat(sut.matches(['expected item', 7]), __.is(false));
			__.assertThat(sut.matches(['expected item', 7, 'something else']), __.is(false));
		});

		it('should not match if there are too many items', () => {
			__.assertThat(sut.matches(['expected', 'an item', 7, 'another item']), __.is(false));
		});

		it('should not match if items are missing', () => {
			__.assertThat(sut.matches(['expected', 7]), __.is(false));
			__.assertThat(sut.matches([]), __.is(false));
		});

		it('should not match non-arrays', () => {
			__.assertThat(sut.matches(), __.is(false));
			__.assertThat(sut.matches('expected item, but not an array'), __.is(false));
			__.assertThat(sut.matches({
				key: 'expected, but an object property',
				key2: 'an object property item'
			}), __.is(false));
		});

		describe('description', () => {
			let description;

			beforeEach(() => {
				description = new __.Description();
			});

			it('should contain item description', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('[a string containing "expected", a string containing "item", <7>] in any order'));
			});

			it('should contain surplus items', () => {

				sut.describeMismatch(['expected', 7, 100, 'item', 'surplus item'], description);

				__.assertThat(description.get(), __.equalTo('not matched:\n\t<100>,\n\t"surplus item"\nfrom [\n\t"expected",\n\t<7>,\n\t<100>,\n\t"item",\n\t"surplus item"\n]'));
			});

			it('should contain unmatched matchers', () => {

				sut.describeMismatch([7], description);

				__.assertThat(description.get(), __.equalTo('no item in [<7>] matches:\n\ta string containing "expected",\n\ta string containing "item"'));
			});

			it('should fit for non-arrays', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
