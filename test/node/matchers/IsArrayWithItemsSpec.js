'use strict';

const assert = require('assert');

const __ = require('../../..');

describe('IsArrayWithItems', () => {

	describe('hasItems', () => {
		let sut;
		beforeEach(() => {
			sut = __.hasItems(__.containsString('expected'), 7);
		});

		it('should match if all matchers match', () => {
			assert.ok(sut.matches(['expected item', 'another item', 7]));
			assert.ok(sut.matches(['another item', 7, 'expected item']));
		});

		it('should not match if one matcher fails', () => {
			assert.equal(sut.matches(['expected', 6]), false);
			assert.equal(sut.matches(['another item', 7]), false);
		});

		it('should not match non-arrays', () => {
			assert.equal(sut.matches(), false);
			assert.equal(sut.matches('not an array'), false);
			assert.equal(sut.matches({
				key: 'expected, but an object property',
				key2: 7
			}), false);
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

				console.log('XXXX', description.get());

				__.assertThat(description.get(), __.containsString('<7>: \n\titem 0: was "expected"\n\titem 1: was <6>'));
			});

			it('should fit for non-arrays', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
