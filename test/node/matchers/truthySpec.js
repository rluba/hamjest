'use strict';

const _ = require('lodash');
const __ = require('../../..');

describe('truthy', () => {
	let sut;
	beforeEach(() => {
		sut = __.truthy();
	});

	_.forEach([
		true,
		'a string',
		5,
		[],
		{}
	], (value) => {
		it('should match truthy values: ' + value, () => {
			__.assertThat(sut.matches(value), __.is(true));
		});
	});

	_.forEach([
		false,
		null,
		undefined,
		''
	], (value) => {
		it('should not match falsy values: ' + value, () => {
			__.assertThat(sut.matches(value), __.is(false));
		});
	});

	describe('description', () => {
		let description;
		beforeEach(() => {
			description = new __.Description();
		});

		it('should be concise', () => {

			sut.describeTo(description);

			__.assertThat(description.get(), __.equalTo('truthy value'));
		});

		it('should contain mismatched value', () => {

			sut.describeMismatch(0, description);

			__.assertThat(description.get(), __.equalTo('was <0>'));
		});
	});
});
