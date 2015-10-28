'use strict';

var IsArrayOrderedBy = require('../../lib/matchers/IsArrayOrderedBy')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	;

describe('IsArrayOrderedBy', function () {

	describe('orderedBy', function () {
		var orderedBy = IsArrayOrderedBy.orderedBy;
		var sut;

		beforeEach(function () {
			sut = orderedBy(function (a, b) { return a < b; }, 'ascending');
		});

		it('should match if all objects are in order', function () {
			__.assertThat(sut.matches([5, 7, 9, 12]), __.is(true));

			__.assertThat(sut.matches([7, 5, 9, 12]), __.is(false));
			__.assertThat(sut.matches([5, 9, 7, 12]), __.is(false));
		});

		it('should not match non-arrays', function () {
			__.assertThat(sut.matches(), __.is(false));
			__.assertThat(sut.matches('not an array'), __.is(false));
			__.assertThat(sut.matches({
				key: 'an object',
				key2: 7
			}), __.is(false));
		});

		describe('description', function () {
			var description;

			beforeEach(function () {
				description = new Description();
			});

			it('should contain comparison description', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('an array ordered ascending'));
			});

			it('should contain comparator name if description is missing', function () {
				sut = orderedBy(function descending(a, b) { return a > b; });

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('an array ordered descending'));
			});

			it('should contain first mismatch', function () {

				sut.describeMismatch([5, 9, 8, 7], description);

				__.assertThat(description.get(), __.equalTo('<9> at index 1 and <8> at index 2 are not in order'));
			});

			it('should fit for non-arrays', function () {
				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
