'use strict';

const AssertionError = require('assertion-error');
const __ = require('../../..');
const assertTrue = require('../asserts').assertTrue;
const assertFalse = require('../asserts').assertFalse;

describe('DateComparisonMatcher', () => {

	const thresholdDate = new Date('2014-07-14T12:00:00');

	describe('after', () => {
		let sut;
		beforeEach(() => {
			sut = __.after(thresholdDate);
		});

		it('should throw for non-date arguments', () => {
			__.assertThat(() => {
				__.after(5);
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match dates correctly', () => {
			assertTrue(sut.matches(new Date('2014-07-15T11:00:00')));
			assertTrue(sut.matches(new Date('2014-07-14T13:00:00')));
			assertFalse(sut.matches(new Date('2014-07-14T12:00:00')));
			assertFalse(sut.matches(new Date('2014-07-14T11:00:00')));
			assertFalse(sut.matches(new Date('2014-07-13T13:00:00')));
		});

		it('should not match non-dates', () => {
			assertFalse(sut.matches());
			assertFalse(sut.matches(8));
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should contain value', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a date after "2014-07-14T12:00:00.000Z"'));
			});

			it('should contain mismatched date', () => {
				const mismatch = new Date('2014-07-14T11:00:00');

				sut.describeMismatch(mismatch, description);

				__.assertThat(description.get(), __.equalTo('was "2014-07-14T11:00:00.000Z"'));
			});

			it('should contain non-date values', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});

	describe('afterOrEqualTo', () => {
		let sut;
		beforeEach(() => {
			sut = __.afterOrEqualTo(thresholdDate);
		});

		it('should throw for non-date arguments', () => {
			__.assertThat(() => {
				__.afterOrEqualTo(5);
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match dates correctly', () => {
			assertTrue(sut.matches(new Date('2014-07-15T11:00:00')));
			assertTrue(sut.matches(new Date('2014-07-14T13:00:00')));
			assertTrue(sut.matches(new Date('2014-07-14T12:00:00')));
			assertFalse(sut.matches(new Date('2014-07-14T11:00:00')));
			assertFalse(sut.matches(new Date('2014-07-13T13:00:00')));
		});

		it('should not match non-dates', () => {
			assertFalse(sut.matches());
			assertFalse(sut.matches(8));
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should contain value', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a date after or equal to "2014-07-14T12:00:00.000Z"'));
			});

			it('should contain mismatched date', () => {
				const mismatch = new Date('2014-07-14T11:00:00');

				sut.describeMismatch(mismatch, description);

				__.assertThat(description.get(), __.equalTo('was "2014-07-14T11:00:00.000Z"'));
			});

			it('should contain non-date values', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});

	describe('before', () => {
		let sut;
		beforeEach(() => {
			sut = __.before(thresholdDate);
		});

		it('should throw for non-date arguments', () => {
			__.assertThat(() => {
				__.before(5);
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match dates correctly', () => {
			assertFalse(sut.matches(new Date('2014-07-15T11:00:00')));
			assertFalse(sut.matches(new Date('2014-07-14T13:00:00')));
			assertFalse(sut.matches(new Date('2014-07-14T12:00:00')));
			assertTrue(sut.matches(new Date('2014-07-14T11:00:00')));
			assertTrue(sut.matches(new Date('2014-07-13T13:00:00')));
		});

		it('should not match non-dates', () => {
			assertFalse(sut.matches());
			assertFalse(sut.matches(8));
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should contain value', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a date before "2014-07-14T12:00:00.000Z"'));
			});

			it('should contain mismatched date', () => {
				const mismatch = new Date('2014-07-14T13:00:00');

				sut.describeMismatch(mismatch, description);

				__.assertThat(description.get(), __.equalTo('was "2014-07-14T13:00:00.000Z"'));
			});

			it('should contain non-date values', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});

	describe('beforeOrEqualTo', () => {
		let sut;
		beforeEach(() => {
			sut = __.beforeOrEqualTo(thresholdDate);
		});

		it('should throw for non-date arguments', () => {
			__.assertThat(() => {
				__.beforeOrEqualTo(5);
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match dates correctly', () => {
			assertFalse(sut.matches(new Date('2014-07-15T11:00:00')));
			assertFalse(sut.matches(new Date('2014-07-14T13:00:00')));
			assertTrue(sut.matches(new Date('2014-07-14T12:00:00')));
			assertTrue(sut.matches(new Date('2014-07-14T11:00:00')));
			assertTrue(sut.matches(new Date('2014-07-13T13:00:00')));
		});

		it('should not match non-dates', () => {
			assertFalse(sut.matches());
			assertFalse(sut.matches(8));
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should contain value', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a date before or equal to "2014-07-14T12:00:00.000Z"'));
			});

			it('should contain mismatched date', () => {
				const mismatch = new Date('2014-07-14T13:00:00');

				sut.describeMismatch(mismatch, description);

				__.assertThat(description.get(), __.equalTo('was "2014-07-14T13:00:00.000Z"'));
			});

			it('should contain non-date values', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
