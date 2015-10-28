'use strict';

var AssertionError = require('assertion-error')
	, IsCloseTo = require('../../lib/matchers/IsCloseTo')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	;

describe('IsCloseTo', function () {

	describe('closeTo', function () {
		var closeTo = IsCloseTo.closeTo;
		var sut;

		beforeEach(function () {
			sut = closeTo(7, 0.5);
		});

		it('should throw for non-number arguments', function () {
			__.assertThat(function () {
				closeTo('5', 0.5);
			}, __.throws(__.instanceOf(AssertionError)));

			__.assertThat(function () {
				closeTo(1, '0.2');
			}, __.throws(__.instanceOf(AssertionError)));

			__.assertThat(function () {
				closeTo(1);
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should throw for missing delta', function () {
			__.assertThat(function () {
				closeTo(1);
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match numbers correctly', function () {
			__.assertThat(sut.matches(6.5), __.is(true));
			__.assertThat(sut.matches(6.50001), __.is(true));
			__.assertThat(sut.matches(7), __.is(true));
			__.assertThat(sut.matches(7.5), __.is(true));

			__.assertThat(sut.matches(6.49), __.is(false));
			__.assertThat(sut.matches(7.51), __.is(false));
		});

		it('should not match non-numbers', function () {
			__.assertThat(sut.matches(), __.is(false));
			__.assertThat(sut.matches('7'), __.is(false));
		});

		describe('description', function () {
			var description;

			beforeEach(function () {
				description = new Description();
			});

			it('should contain value and delta', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a number within <0.5> of <7>'));
			});

			it('should contain mismatched number and real delta', function () {

				sut.describeMismatch(6.49, description);

				__.assertThat(description.get(), __.matchesPattern(/<6\.49> differed by <0\.5\d*>/));
			});

			it('should contain non-number values', function () {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
