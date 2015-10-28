'use strict';

var IsArrayContainingInAnyOrder = require('../../lib/matchers/IsArrayContainingInAnyOrder')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	;

describe('IsArrayContainingInAnyOrder', function () {

	describe('containsInAnyOrder', function () {
		var containsInAnyOrder = IsArrayContainingInAnyOrder.containsInAnyOrder;
		var sut;

		beforeEach(function () {
			sut = containsInAnyOrder(__.containsString('expected'), __.containsString('item'), 7);
		});

		it('should match if all matchers match an item', function () {
			__.assertThat(sut.matches(['expected', 'an item', 7]), __.is(true));
			__.assertThat(sut.matches(['an item', 7, 'expected']), __.is(true));
		});

		it('should not match if there is no 1:1 relation between items and matchers', function () {
			__.assertThat(sut.matches(['expected item', 7]), __.is(false));
			__.assertThat(sut.matches(['expected item', 7, 'something else']), __.is(false));
		});

		it('should not match if there are too many items', function () {
			__.assertThat(sut.matches(['expected', 'an item', 7, 'another item']), __.is(false));
		});

		it('should not match if items are missing', function () {
			__.assertThat(sut.matches(['expected', 7]), __.is(false));
			__.assertThat(sut.matches([]), __.is(false));
		});

		it('should not match non-arrays', function () {
			__.assertThat(sut.matches(), __.is(false));
			__.assertThat(sut.matches('expected item, but not an array'), __.is(false));
			__.assertThat(sut.matches({
				key: 'expected, but an object property',
				key2: 'an object property item'
			}), __.is(false));
		});

		describe('description', function () {
			var description;

			beforeEach(function () {
				description = new Description();
			});

			it('should contain item description', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('[a string containing "expected", a string containing "item", <7>] in any order'));
			});

			it('should contain surplus items', function () {

				sut.describeMismatch(['expected', 7, 100, 'item', 'surplus item'], description);

				__.assertThat(description.get(), __.equalTo('not matched: <100>, "surplus item" from ["expected", <7>, <100>, "item", "surplus item"]'));
			});

			it('should contain unmatched matchers', function () {

				sut.describeMismatch([7], description);

				__.assertThat(description.get(), __.equalTo('no item in [<7>] matches: a string containing "expected", a string containing "item"'));
			});

			it('should fit for non-arrays', function () {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
