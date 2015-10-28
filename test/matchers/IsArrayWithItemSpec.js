'use strict';

var IsArrayWithItem = require('../../lib/matchers/IsArrayWithItem')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	;

describe('IsArrayWithItem', function () {

	describe('hasItem', function () {
		var hasItem = IsArrayWithItem.hasItem;
		var sut;

		beforeEach(function () {
			sut = hasItem(__.containsString('expected'));
		});

		it('should match if any item matches', function () {
			assertTrue(sut.matches(['expected item']));
			assertTrue(sut.matches(['an item', 7, 'expected item']));
			assertTrue(sut.matches(['an item', 'expected item', 'another item']));
		});

		it('should not match if no item matches', function () {
			assertFalse(sut.matches([]));
			assertFalse(sut.matches(['a string value', 7]));
		});

		it('should not match non-arrays', function () {
			assertFalse(sut.matches());
			assertFalse(sut.matches('expected, but not an array'));
			assertFalse(sut.matches({key: 'expected, but an object property'}));
		});

		it('should wrap simple value in equalTo matcher', function () {
			sut = hasItem('expected item');

			assertTrue(sut.matches(['an item', 'expected item']));
			assertFalse(sut.matches(['an item', 'almost expected item']));
		});

		describe('description', function () {
			var description;

			beforeEach(function () {
				description = new Description();
			});

			it('should contain item description', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('an array containing a string containing "expected"'));
			});

			it('should fit for empty arrays', function () {

				sut.describeMismatch([], description);

				__.assertThat(description.get(), __.equalTo('was empty'));
			});

			it('should contain every mismatch', function () {

				sut.describeMismatch(['a value', 7], description);

				__.assertThat(description.get(), __.equalTo('[was "a value", was a Number (<7>)]'));
			});

			it('should fit for non-arrays', function () {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
