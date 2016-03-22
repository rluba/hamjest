'use strict';

const _ = require('lodash');
const __ = require('../../..');

describe('TypeSafeMatcher', () => {
	let sut;

	beforeEach(() => {
		sut = _.create(new __.TypeSafeMatcher(), {
			isExpectedType: () => {
				return false;
			},
			machesSafely: () => {
				return false;
			}
		});
	});

	describe('description', () => {
		let description;
		beforeEach(() => {
			description = new __.Description();
		});

		it('should describe undefined as "undefined"', () => {

			sut.describeMismatch(undefined, description);

			__.assertThat(description.get(), __.equalTo('was undefined'));
		});

		it('should describe null as "null"', () => {

			sut.describeMismatch(null, description);

			__.assertThat(description.get(), __.equalTo('was null'));
		});
	});
});
