'use strict';

var IsArrayWithItems = require('../../lib/matchers/IsArrayWithItems')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	;

describe('IsArrayWithItems', function () {

	describe('hasItems', function () {
		var hasItems = IsArrayWithItems.hasItems;
		var sut;

		beforeEach(function () {
			sut = hasItems(__.containsString('expected'), 7);
		});

		it('should match if all matchers match', function () {
			assertTrue(sut.matches(['expected item', 'another item', 7]));
			assertTrue(sut.matches(['another item', 7, 'expected item']));
		});

		it('should not match if one matcher fails', function () {
			assertFalse(sut.matches(['expected', 6]));
			assertFalse(sut.matches(['another item', 7]));
		});

		it('should not match non-arrays', function () {
			assertFalse(sut.matches());
			assertFalse(sut.matches('not an array'));
			assertFalse(sut.matches({
				key: 'expected, but an object property',
				key2: 7
			}));
		});

		describe('description', function () {
			var description;

			beforeEach(function () {
				description = new Description();
			});

			it('should contain item description', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('an array containing a string containing "expected", <7>'));
			});

			it('should fit for empty arrays', function () {

				sut.describeMismatch([], description);

				__.assertThat(description.get(), __.equalTo('was empty'));
			});

			it('should contain every mismatch for mismatching matcher', function () {

				sut.describeMismatch(['expected', 6], description);

				__.assertThat(description.get(), __.containsString('<7>: [was "expected", was <6>]'));
			});

			it('should fit for non-arrays', function () {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
