'use strict';

var IsArrayContaining = require('../../lib/matchers/IsArrayContaining')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	;

describe('IsArrayContaining', function () {

	describe('contains', function () {
		var contains = IsArrayContaining.contains;
		var sut;

		beforeEach(function () {
			sut = contains(__.containsString('expected'), 7);
		});

		it('should match if all matchers match in order', function () {
			__.assertThat(sut.matches(['expected item', 7]), __.is(true));
			__.assertThat(sut.matches([7, 'expected item']), __.is(false));
		});

		it('should not match if there are too many items', function () {
			__.assertThat(sut.matches(['expected', 7, 7]), __.is(false));
		});

		it('should not match if items are missing', function () {
			__.assertThat(sut.matches(['expected']), __.is(false));
			__.assertThat(sut.matches([]), __.is(false));
		});

		it('should not match non-arrays', function () {
			__.assertThat(sut.matches(), __.is(false));
			__.assertThat(sut.matches('not an array'), __.is(false));
			__.assertThat(sut.matches({
				key: 'expected, but an object property',
				key2: 7
			}), __.is(false));
		});

		describe('description', function () {
			var description;

			beforeEach(function () {
				description = new Description();
			});

			it('should contain item description', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('[a string containing "expected", <7>]'));
			});

			it('should contain all mismatches', function () {

				sut.describeMismatch([5, 6, 7], description);

				__.assertThat(description.get(), __.equalTo('item 0: was a Number (<5>)\nitem 1: was <6>\nnot matched: <7>'));
			});

			it('should contain surplus items', function () {

				sut.describeMismatch(['expected', 7, 'surplus 1', 100], description);

				__.assertThat(description.get(), __.equalTo('not matched: "surplus 1", <100>'));
			});

			it('should contain unmatched matchers', function () {

				sut.describeMismatch([], description);

				__.assertThat(description.get(), __.equalTo('missing: a string containing "expected", <7>'));
			});

			it('should fit for non-arrays', function () {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
