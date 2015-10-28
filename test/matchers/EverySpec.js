'use strict';

var Every = require('../../lib/matchers/Every')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	;

describe('Every', function () {

	describe('everyItem', function () {
		var everyItem = Every.everyItem;

		var sut;

		beforeEach(function () {
			sut = everyItem(__.string());
		});

		it('should match arrays', function () {
			__.assertThat(sut.matches([]), __.is(true));
			__.assertThat(sut.matches(['a', 'b']), __.is(true));

			__.assertThat(sut.matches(['a', 1]), __.is(false));
			__.assertThat(sut.matches([1, 'a']), __.is(false));
		});

		it('should match objects', function () {
			__.assertThat(sut.matches({}), __.is(true));
			__.assertThat(sut.matches({a: '1', b: '2'}), __.is(true));

			__.assertThat(sut.matches({a: '1', b: 2}), __.is(false));
			__.assertThat(sut.matches({a: 1, b: '2'}), __.is(false));
		});

		it('should not match other types', function () {
			__.assertThat(sut.matches('a'), __.is(false));
			__.assertThat(sut.matches(12), __.is(false));
		});

		it('should wrap simple value in equalTo matcher', function () {
			sut = everyItem('a');

			__.assertThat(sut.matches([]), __.is(true));
			__.assertThat(sut.matches(['a', 'a']), __.is(true));
			__.assertThat(sut.matches(['a', 'c']), __.is(false));
		});

		describe('description', function () {
			var description;

			beforeEach(function () {
				description = new Description();
			});

			it('should contain matcher description', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('every item is a string'));
			});

			it('should contain mismatched values', function () {

				sut.describeMismatch([1, 'a', 2], description);

				__.assertThat(description.get(), __.equalTo('item <0> was a Number (<1>), item <2> was a Number (<2>)'));
			});

			it('should contain mismatched values', function () {

				sut.describeMismatch({x: 'a', y: 2}, description);

				__.assertThat(description.get(), __.equalTo('item "y" was a Number (<2>)'));
			});

			it('should fit for non-arrays', function () {

				sut.describeMismatch(7, description);

				__.assertThat(description.get(), __.equalTo('was a Number (<7>)'));
			});
		});
	});
});
