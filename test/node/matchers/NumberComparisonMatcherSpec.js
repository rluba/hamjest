'use strict';

const assert = require('assert');

const AssertionError = require('assertion-error');
const __ = require('../../..');

describe('NumberComparisonMatcher', () => {

	describe('greaterThan', () => {
		let sut;
		beforeEach(() => {
			sut = __.greaterThan(7);
		});

		it('should throw for non-number arguments', () => {
			__.assertThat(() => {
				__.greaterThan('5');
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match numbers correctly', () => {
			assert.ok(sut.matches(8));
			assert.ok(sut.matches(7.01));
			assert.equal(sut.matches(7), false);
			assert.equal(sut.matches(6.9), false);
		});

		it('should not match non-numbers', () => {
			assert.equal(sut.matches(), false);
			assert.equal(sut.matches('8'), false);
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should contain value', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a number greater than <7>'));
			});

			it('should contain mismatched number', () => {

				sut.describeMismatch(6, description);

				__.assertThat(description.get(), __.equalTo('was <6>'));
			});

			it('should contain non-number values', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});

	describe('greaterThanOrEqualTo', () => {
		let sut;
		beforeEach(() => {
			sut = __.greaterThanOrEqualTo(7);
		});

		it('should throw for non-number arguments', () => {
			__.assertThat(() => {
				__.greaterThanOrEqualTo('5');
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match numbers correctly', () => {
			assert.ok(sut.matches(8));
			assert.ok(sut.matches(7.01));
			assert.ok(sut.matches(7));
			assert.equal(sut.matches(6.9), false);
			assert.equal(sut.matches(6), false);
		});

		it('should not match non-numbers', () => {
			assert.equal(sut.matches(), false);
			assert.equal(sut.matches('8'), false);
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should contain value', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a number greater than or equal to <7>'));
			});

			it('should contain mismatched number', () => {

				sut.describeMismatch(6, description);

				__.assertThat(description.get(), __.equalTo('was <6>'));
			});

			it('should contain non-number values', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});

	describe('lessThan', () => {
		let sut;
		beforeEach(() => {
			sut = __.lessThan(12);
		});

		it('should throw for non-number arguments', () => {
			__.assertThat(() => {
				__.lessThan('5');
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match numbers correctly', () => {
			assert.ok(sut.matches(11.9));
			assert.ok(sut.matches(11));
			assert.equal(sut.matches(12), false);
			assert.equal(sut.matches(12.01), false);
			assert.equal(sut.matches(13), false);
		});

		it('should not match non-numbers', () => {
			assert.equal(sut.matches(), false);
			assert.equal(sut.matches('8'), false);
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should contain value', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a number less than <12>'));
			});

			it('should contain mismatched number', () => {

				sut.describeMismatch(12, description);

				__.assertThat(description.get(), __.equalTo('was <12>'));
			});

			it('should contain non-number values', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});

	describe('lessThanOrEqualTo', () => {
		let sut;
		beforeEach(() => {
			sut = __.lessThanOrEqualTo(12);
		});

		it('should throw for non-number arguments', () => {
			__.assertThat(() => {
				__.lessThanOrEqualTo('5');
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match numbers correctly', () => {
			assert.ok(sut.matches(11.9));
			assert.ok(sut.matches(11));
			assert.ok(sut.matches(12));
			assert.equal(sut.matches(12.01), false);
			assert.equal(sut.matches(13), false);
		});

		it('should not match non-numbers', () => {
			assert.equal(sut.matches(), false);
			assert.equal(sut.matches('8'), false);
		});

		describe('description', () => {
			let description;

			beforeEach(() => {
				description = new __.Description();
			});

			it('should contain value', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a number less than or equal to <12>'));
			});

			it('should contain mismatched number', () => {

				sut.describeMismatch(14, description);

				__.assertThat(description.get(), __.equalTo('was <14>'));
			});

			it('should contain non-number values', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
