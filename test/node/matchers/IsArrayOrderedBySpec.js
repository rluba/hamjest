'use strict';

const __ = require('../../..');

describe('IsArrayOrderedBy', () => {

	describe('orderedBy', () => {
		let sut;
		beforeEach(() => {
			sut = __.orderedBy((a, b) => a < b, 'ascending');
		});

		it('should match if all objects are in order', () => {
			__.assertThat(sut.matches([5, 7, 9, 12]), __.is(true));

			__.assertThat(sut.matches([7, 5, 9, 12]), __.is(false));
			__.assertThat(sut.matches([5, 9, 7, 12]), __.is(false));
		});

		it('should not match non-arrays', () => {
			__.assertThat(sut.matches(), __.is(false));
			__.assertThat(sut.matches('not an array'), __.is(false));
			__.assertThat(sut.matches({
				key: 'an object',
				key2: 7
			}), __.is(false));
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should contain comparison description', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('an array ordered ascending'));
			});

			it('should contain comparator name if description is missing', () => {
				function descending(a, b) { return a > b; }
				sut = __.orderedBy(descending);

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('an array ordered descending'));
			});

			it('should contain first mismatch', () => {

				sut.describeMismatch([5, 9, 8, 7], description);

				__.assertThat(description.get(), __.equalTo('<9> at index 1 and <8> at index 2 are not in order'));
			});

			it('should fit for non-arrays', () => {
				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
