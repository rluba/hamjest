'use strict';

var AssertionError = require('assertion-error');
var __ = require('../../..');
var assertTrue = require('../asserts').assertTrue;
var assertFalse = require('../asserts').assertFalse;

describe('NumberComparisonMatcher', function () {

	describe('greaterThan', function () {
		var sut;
		beforeEach(function () {
			sut = __.greaterThan(7);
		});

		it('should throw for non-number arguments', function () {
			__.assertThat(function () {
				__.greaterThan('5');
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match numbers correctly', function () {
			assertTrue(sut.matches(8));
			assertTrue(sut.matches(7.01));
			assertFalse(sut.matches(7));
			assertFalse(sut.matches(6.9));
		});

		it('should not match non-numbers', function () {
			assertFalse(sut.matches());
			assertFalse(sut.matches('8'));
		});

		describe('description', function () {
			var description;
			beforeEach(function () {
				description = new __.Description();
			});

			it('should contain value', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a number greater than <7>'));
			});

			it('should contain mismatched number', function () {

				sut.describeMismatch(6, description);

				__.assertThat(description.get(), __.equalTo('was <6>'));
			});

			it('should contain non-number values', function () {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});

	describe('greaterThanOrEqualTo', function () {
		var sut;
		beforeEach(function () {
			sut = __.greaterThanOrEqualTo(7);
		});

		it('should throw for non-number arguments', function () {
			__.assertThat(function () {
				__.greaterThanOrEqualTo('5');
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match numbers correctly', function () {
			assertTrue(sut.matches(8));
			assertTrue(sut.matches(7.01));
			assertTrue(sut.matches(7));
			assertFalse(sut.matches(6.9));
			assertFalse(sut.matches(6));
		});

		it('should not match non-numbers', function () {
			assertFalse(sut.matches());
			assertFalse(sut.matches('8'));
		});

		describe('description', function () {
			var description;
			beforeEach(function () {
				description = new __.Description();
			});

			it('should contain value', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a number greater than or equal to <7>'));
			});

			it('should contain mismatched number', function () {

				sut.describeMismatch(6, description);

				__.assertThat(description.get(), __.equalTo('was <6>'));
			});

			it('should contain non-number values', function () {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});

	describe('lessThan', function () {
		var sut;
		beforeEach(function () {
			sut = __.lessThan(12);
		});

		it('should throw for non-number arguments', function () {
			__.assertThat(function () {
				__.lessThan('5');
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match numbers correctly', function () {
			assertTrue(sut.matches(11.9));
			assertTrue(sut.matches(11));
			assertFalse(sut.matches(12));
			assertFalse(sut.matches(12.01));
			assertFalse(sut.matches(13));
		});

		it('should not match non-numbers', function () {
			assertFalse(sut.matches());
			assertFalse(sut.matches('8'));
		});

		describe('description', function () {
			var description;
			beforeEach(function () {
				description = new __.Description();
			});

			it('should contain value', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a number less than <12>'));
			});

			it('should contain mismatched number', function () {

				sut.describeMismatch(12, description);

				__.assertThat(description.get(), __.equalTo('was <12>'));
			});

			it('should contain non-number values', function () {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});

	describe('lessThanOrEqualTo', function () {
		var sut;
		beforeEach(function () {
			sut = __.lessThanOrEqualTo(12);
		});

		it('should throw for non-number arguments', function () {
			__.assertThat(function () {
				__.lessThanOrEqualTo('5');
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match numbers correctly', function () {
			assertTrue(sut.matches(11.9));
			assertTrue(sut.matches(11));
			assertTrue(sut.matches(12));
			assertFalse(sut.matches(12.01));
			assertFalse(sut.matches(13));
		});

		it('should not match non-numbers', function () {
			assertFalse(sut.matches());
			assertFalse(sut.matches('8'));
		});

		describe('description', function () {
			var description;

			beforeEach(function () {
				description = new __.Description();
			});

			it('should contain value', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a number less than or equal to <12>'));
			});

			it('should contain mismatched number', function () {

				sut.describeMismatch(14, description);

				__.assertThat(description.get(), __.equalTo('was <14>'));
			});

			it('should contain non-number values', function () {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
