'use strict';

const __ = require('../../..');

describe('IsDefined', () => {

	describe('defined', () => {
		let sut;
		beforeEach(() => {
			sut = __.defined();
		});

		it('should match any value', () => {
			__.assertThat(sut.matches(0), __.is(true));
			__.assertThat(sut.matches(''), __.is(true));
			__.assertThat(sut.matches([]), __.is(true));
			__.assertThat(sut.matches({}), __.is(true));

			__.assertThat(sut.matches(), __.is(false));
			__.assertThat(sut.matches(undefined), __.is(false));
		});

		describe('description', () => {
			let description;

			beforeEach(() => {
				description = new __.Description();
			});

			it('should be concise', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('defined'));
			});

			it('should contain mismatched values', () => {
				const description = new __.Description();

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was {"an":"object"}'));
			});
		});
	});

	describe('undefined', () => {
		let sut;
		beforeEach(() => {
			sut = __.undefined();
		});

		it('should not match any value', () => {
			__.assertThat(sut.matches(0), __.is(false));
			__.assertThat(sut.matches(''), __.is(false));
			__.assertThat(sut.matches([]), __.is(false));
			__.assertThat(sut.matches({}), __.is(false));

			__.assertThat(sut.matches(), __.is(true));
			__.assertThat(sut.matches(undefined), __.is(true));
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should be concise', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('not defined'));
			});

			it('should contain mismatched values', () => {
				const description = new __.Description();

				sut.describeMismatch({an: 'object'}, description);

				__.assertThat(description.get(), __.equalTo('was {"an":"object"}'));
			});
		});
	});

	it('should be available as "undef"', () => {
		__.assertThat(__.undef, __.equalTo(__.undefined));
	});

});
