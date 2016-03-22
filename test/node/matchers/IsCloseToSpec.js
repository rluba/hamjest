'use strict';

const AssertionError = require('assertion-error');
const __ = require('../../..');

describe('IsCloseTo', () => {

	describe('closeTo', () => {
		let sut;
		beforeEach(() => {
			sut = __.closeTo(7, 0.5);
		});

		it('should throw for non-number arguments', () => {
			__.assertThat(() => {
				__.closeTo('5', 0.5);
			}, __.throws(__.instanceOf(AssertionError)));

			__.assertThat(() => {
				__.closeTo(1, '0.2');
			}, __.throws(__.instanceOf(AssertionError)));

			__.assertThat(() => {
				__.closeTo(1);
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should throw for missing delta', () => {
			__.assertThat(() => {
				__.closeTo(1);
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match numbers correctly', () => {
			__.assertThat(sut.matches(6.5), __.is(true));
			__.assertThat(sut.matches(6.50001), __.is(true));
			__.assertThat(sut.matches(7), __.is(true));
			__.assertThat(sut.matches(7.5), __.is(true));

			__.assertThat(sut.matches(6.49), __.is(false));
			__.assertThat(sut.matches(7.51), __.is(false));
		});

		it('should not match non-numbers', () => {
			__.assertThat(sut.matches(), __.is(false));
			__.assertThat(sut.matches('7'), __.is(false));
		});

		describe('description', () => {
			let description;

			beforeEach(() => {
				description = new __.Description();
			});

			it('should contain value and delta', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a number within <0.5> of <7>'));
			});

			it('should contain mismatched number and real delta', () => {

				sut.describeMismatch(6.49, description);

				__.assertThat(description.get(), __.matchesPattern(/<6\.49> differed by <0\.5\d*>/));
			});

			it('should contain non-number values', () => {

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
			});
		});
	});
});
