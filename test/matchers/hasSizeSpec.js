'use strict';

var hasSize = require('../../lib/matchers/hasSize')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	;

describe('hasSize', function () {

	var sut;
	beforeEach(function () {
		sut = hasSize(__.greaterThan(2));
	});

	it('should match arrays', function () {
		__.assertThat(sut.matches(['a', 'b', 'c']), __.is(true));
		__.assertThat(sut.matches(['a', 'c']), __.is(false));
		__.assertThat(sut.matches([]), __.is(false));
	});

	it('should match objects', function () {
		__.assertThat(sut.matches({a: '1', b: 2, c: '3'}), __.is(true));
		__.assertThat(sut.matches({a: '1', b: 2}), __.is(false));
		__.assertThat(sut.matches({}), __.is(false));
	});

	it('should match strings', function () {
		__.assertThat(sut.matches('a long string'), __.is(true));
		__.assertThat(sut.matches('xs'), __.is(false));
	});

	it('should not match other types', function () {
		__.assertThat(sut.matches(12), __.is(false));
		__.assertThat(sut.matches(new Date()), __.is(false));
	});

	it('should wrap simple value in equalTo matcher', function () {
		sut = hasSize(2);

		__.assertThat(sut.matches(['a', 'b', 'c']), __.is(false));
		__.assertThat(sut.matches(['a', 'c']), __.is(true));
		__.assertThat(sut.matches([]), __.is(false));
	});

	describe('description', function () {
		var description;

		beforeEach(function () {
			description = new Description();
		});

		it('should contain matcher description', function () {

			sut.describeTo(description);

			__.assertThat(description.get(), __.equalTo('a collection or string with size a number greater than <2>'));
		});

		it('should contain mismatched value and size', function () {

			sut.describeMismatch(['a'], description);

			__.assertThat(description.get(), __.equalTo('size was <1>\nfor ["a"]'));
		});

		it('should fit for non-arrays', function () {

			sut.describeMismatch(7, description);

			__.assertThat(description.get(), __.equalTo('was a Number (<7>)'));
		});
	});
});
