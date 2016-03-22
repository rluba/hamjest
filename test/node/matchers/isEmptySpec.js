'use strict';

const _ = require('lodash');
const __ = require('../../..');

describe('isEmptySpec', () => {

	let sut;
	beforeEach(() => {
		sut = __.isEmpty();
	});

	it('should be available as "empty" too', () => {

		__.assertThat(__.empty, __.is(__.isEmpty));
	});

	_.forEach([
		{given: [], expected: true},
		{given: ['a'], expected: false}
	], (params) => {
		it('should match arrays: ' + params.given, () => {

			__.assertThat(sut.matches(params.given), __.is(params.expected));
		});
	});

	_.forEach([
		{given: {}, expected: true},
		{given: {a: '1'}, expected: false}
	], (params) => {
		it('should match objects: ' + params.given, () => {

			__.assertThat(sut.matches(params.given), __.is(params.expected));
		});
	});

	_.forEach([
		{given: '', expected: true},
		{given: 'x', expected: false},
		{given: 'a long string', expected: false}
	], (params) => {
		it('should match strings: ' + params.given, () => {

			__.assertThat(sut.matches(params.given), __.is(params.expected));
		});
	});

	_.forEach([
		12,
		0,
		-1
	], (given) => {
		it('should not match numbers: ' + given, () => {

			__.assertThat(sut.matches(given), __.is(false));
		});
	});

	describe('description', () => {
		let description;
		beforeEach(() => {
			description = new __.Description();
		});

		it('should contain simple description', () => {

			sut.describeTo(description);

			__.assertThat(description.get(), __.equalTo('an empty collection or string'));
		});

		it('should contain mismatched value and size', () => {

			sut.describeMismatch(['a'], description);

			__.assertThat(description.get(), __.equalTo('size was <1>\nfor ["a"]'));
		});

		it('should fit for non-arrays', () => {

			sut.describeMismatch(7, description);

			__.assertThat(description.get(), __.equalTo('was a Number (<7>)'));
		});
	});
});
