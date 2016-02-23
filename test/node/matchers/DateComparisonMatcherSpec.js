'use strict';

var AssertionError = require('assertion-error');
var __ = require('../../..');
var assertTrue = require('../asserts').assertTrue;
var assertFalse = require('../asserts').assertFalse;

describe('DateComparisonMatcher', function () {

	var thresholdDate = new Date('2014-07-14T12:00:00');

	describe('after', function () {
		var sut;
		beforeEach(function () {
			sut = __.after(thresholdDate);
		});

		it('should throw for non-date arguments', function () {
			__.assertThat(function () {
				__.after(5);
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match dates correctly', function () {
			assertTrue(sut.matches(new Date('2014-07-15T11:00:00')));
			assertTrue(sut.matches(new Date('2014-07-14T13:00:00')));
			assertFalse(sut.matches(new Date('2014-07-14T12:00:00')));
			assertFalse(sut.matches(new Date('2014-07-14T11:00:00')));
			assertFalse(sut.matches(new Date('2014-07-13T13:00:00')));
		});

		it('should not match non-dates', function () {
			assertFalse(sut.matches());
			assertFalse(sut.matches(8));
		});

		describe('description', function () {
			var description;
			beforeEach(function () {
				description = new __.Description();
			});

			it('should contain value', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a date after "2014-07-14T12:00:00.000Z"'));
			});

			it('should contain mismatched date', function () {
				var mismatch = new Date('2014-07-14T11:00:00');

				sut.describeMismatch(mismatch, description);

				__.assertThat(description.get(), __.equalTo('was "2014-07-14T11:00:00.000Z"'));
			});

			it('should contain non-date values', function () {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});

	describe('afterOrEqualTo', function () {
		var sut;
		beforeEach(function () {
			sut = __.afterOrEqualTo(thresholdDate);
		});

		it('should throw for non-date arguments', function () {
			__.assertThat(function () {
				__.afterOrEqualTo(5);
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match dates correctly', function () {
			assertTrue(sut.matches(new Date('2014-07-15T11:00:00')));
			assertTrue(sut.matches(new Date('2014-07-14T13:00:00')));
			assertTrue(sut.matches(new Date('2014-07-14T12:00:00')));
			assertFalse(sut.matches(new Date('2014-07-14T11:00:00')));
			assertFalse(sut.matches(new Date('2014-07-13T13:00:00')));
		});

		it('should not match non-dates', function () {
			assertFalse(sut.matches());
			assertFalse(sut.matches(8));
		});

		describe('description', function () {
			var description;
			beforeEach(function () {
				description = new __.Description();
			});

			it('should contain value', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a date after or equal to "2014-07-14T12:00:00.000Z"'));
			});

			it('should contain mismatched date', function () {
				var mismatch = new Date('2014-07-14T11:00:00');

				sut.describeMismatch(mismatch, description);

				__.assertThat(description.get(), __.equalTo('was "2014-07-14T11:00:00.000Z"'));
			});

			it('should contain non-date values', function () {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});

	describe('before', function () {
		var sut;
		beforeEach(function () {
			sut = __.before(thresholdDate);
		});

		it('should throw for non-date arguments', function () {
			__.assertThat(function () {
				__.before(5);
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match dates correctly', function () {
			assertFalse(sut.matches(new Date('2014-07-15T11:00:00')));
			assertFalse(sut.matches(new Date('2014-07-14T13:00:00')));
			assertFalse(sut.matches(new Date('2014-07-14T12:00:00')));
			assertTrue(sut.matches(new Date('2014-07-14T11:00:00')));
			assertTrue(sut.matches(new Date('2014-07-13T13:00:00')));
		});

		it('should not match non-dates', function () {
			assertFalse(sut.matches());
			assertFalse(sut.matches(8));
		});

		describe('description', function () {
			var description;
			beforeEach(function () {
				description = new __.Description();
			});

			it('should contain value', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a date before "2014-07-14T12:00:00.000Z"'));
			});

			it('should contain mismatched date', function () {
				var mismatch = new Date('2014-07-14T13:00:00');

				sut.describeMismatch(mismatch, description);

				__.assertThat(description.get(), __.equalTo('was "2014-07-14T13:00:00.000Z"'));
			});

			it('should contain non-date values', function () {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});

	describe('beforeOrEqualTo', function () {
		var sut;
		beforeEach(function () {
			sut = __.beforeOrEqualTo(thresholdDate);
		});

		it('should throw for non-date arguments', function () {
			__.assertThat(function () {
				__.beforeOrEqualTo(5);
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match dates correctly', function () {
			assertFalse(sut.matches(new Date('2014-07-15T11:00:00')));
			assertFalse(sut.matches(new Date('2014-07-14T13:00:00')));
			assertTrue(sut.matches(new Date('2014-07-14T12:00:00')));
			assertTrue(sut.matches(new Date('2014-07-14T11:00:00')));
			assertTrue(sut.matches(new Date('2014-07-13T13:00:00')));
		});

		it('should not match non-dates', function () {
			assertFalse(sut.matches());
			assertFalse(sut.matches(8));
		});

		describe('description', function () {
			var description;
			beforeEach(function () {
				description = new __.Description();
			});

			it('should contain value', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a date before or equal to "2014-07-14T12:00:00.000Z"'));
			});

			it('should contain mismatched date', function () {
				var mismatch = new Date('2014-07-14T13:00:00');

				sut.describeMismatch(mismatch, description);

				__.assertThat(description.get(), __.equalTo('was "2014-07-14T13:00:00.000Z"'));
			});

			it('should contain non-date values', function () {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
