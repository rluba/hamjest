'use strict';

const assert = require('assert');

const AssertionError = require('assertion-error');

const __ = require('../../..');

describe('DateComparisonMatcher', () => {

	const thresholdDate = new Date('2014-07-14T12:00:00Z');

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
			assert.ok(sut.matches(new Date('2014-07-15T11:00:00Z')));
			assert.ok(sut.matches(new Date('2014-07-14T13:00:00Z')));
			assert.equal(sut.matches(new Date('2014-07-14T12:00:00Z')), false);
			assert.equal(sut.matches(new Date('2014-07-14T11:00:00Z')), false);
			assert.equal(sut.matches(new Date('2014-07-13T13:00:00Z')), false);
		});

		it('should not match non-dates', () => {
			assert.equal(sut.matches(), false);
			assert.equal(sut.matches(8), false);
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
				const mismatch = new Date('2014-07-14T11:00:00Z');

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
			assert.ok(sut.matches(new Date('2014-07-15T11:00:00Z')));
			assert.ok(sut.matches(new Date('2014-07-14T13:00:00Z')));
			assert.ok(sut.matches(new Date('2014-07-14T12:00:00Z')));
			assert.equal(sut.matches(new Date('2014-07-14T11:00:00Z')), false);
			assert.equal(sut.matches(new Date('2014-07-13T13:00:00Z')), false);
		});

		it('should not match non-dates', () => {
			assert.equal(sut.matches(), false);
			assert.equal(sut.matches(8), false);
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
				const mismatch = new Date('2014-07-14T11:00:00Z');

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
			assert.equal(sut.matches(new Date('2014-07-15T11:00:00Z')), false);
			assert.equal(sut.matches(new Date('2014-07-14T13:00:00Z')), false);
			assert.equal(sut.matches(new Date('2014-07-14T12:00:00Z')), false);
			assert.ok(sut.matches(new Date('2014-07-14T11:00:00Z')));
			assert.ok(sut.matches(new Date('2014-07-13T13:00:00Z')));
		});

		it('should not match non-dates', () => {
			assert.equal(sut.matches(), false);
			assert.equal(sut.matches(8), false);
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
				const mismatch = new Date('2014-07-14T13:00:00Z');

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
			assert.equal(sut.matches(new Date('2014-07-15T11:00:00Z')), false);
			assert.equal(sut.matches(new Date('2014-07-14T13:00:00Z')), false);
			assert.ok(sut.matches(new Date('2014-07-14T12:00:00Z')));
			assert.ok(sut.matches(new Date('2014-07-14T11:00:00Z')));
			assert.ok(sut.matches(new Date('2014-07-13T13:00:00Z')));
		});

		it('should not match non-dates', () => {
			assert.equal(sut.matches(), false);
			assert.equal(sut.matches(8), false);
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
				const mismatch = new Date('2014-07-14T13:00:00Z');

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
