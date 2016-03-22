'use strict';

const _ = require('lodash');
const __ = require('../../..');

describe('inRange', () => {

	describe('with a single parameter', () => {
		let sut;
		beforeEach(() => {
			sut = __.inRange(5);
		});

		_.forEach([
			0, 1, 3, 4, 4.9
		], (value) => {
			it('should match values in range [0, param): ' + value, () => {
				__.assertThat(sut.matches(value), __.is(true));
			});
		});

		_.forEach([
			-0.5, 5, 5.1
		], (value) => {
			it('should not match values outside range [0, param): ' + value, () => {
				__.assertThat(sut.matches(value), __.is(false));
			});
		});

		_.forEach([
			null,
			undefined,
			''
		], (value) => {
			it('should not match non-numbers values: ' + value, () => {
				__.assertThat(sut.matches(value), __.is(false));
			});
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should include range', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a number in range [0, 5)'));
			});

			it('should contain mismatched value', () => {

				sut.describeMismatch(0, description);

				__.assertThat(description.get(), __.equalTo('was <0>'));
			});
		});
	});

	describe('with two parameters', () => {
		let sut;
		beforeEach(() => {
			sut = __.inRange(3, 5.1);
		});

		_.forEach([
			3, 4, 4.9, 5, 5.01
		], (value) => {
			it('should match values in range [a, b): ' + value, () => {
				__.assertThat(sut.matches(value), __.is(true));
			});
		});

		_.forEach([
			2.9, 5.1
		], (value) => {
			it('should not match values outside range [a, b): ' + value, () => {
				__.assertThat(sut.matches(value), __.is(false));
			});
		});

		_.forEach([
			null,
			undefined,
			''
		], (value) => {
			it('should not match non-numbers values: ' + value, () => {
				__.assertThat(sut.matches(value), __.is(false));
			});
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should include range', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a number in range [3, 5.1)'));
			});

			it('should contain mismatched value', () => {

				sut.describeMismatch(0, description);

				__.assertThat(description.get(), __.equalTo('was <0>'));
			});
		});
	});
});
