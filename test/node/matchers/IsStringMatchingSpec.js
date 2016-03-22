'use strict';

const AssertionError = require('assertion-error');
const __ = require('../../..');

describe('IsStringMatching', () => {

	describe('matchesPattern', () => {
		it('should throw for non-string, non-RegExp arguments', () => {
			__.assertThat(() => {
				__.matchesPattern(7);
			}, __.throws(__.instanceOf(AssertionError)));
		});

		describe('with RegExp', () => {
			let sut;

			beforeEach(() => {
				sut = __.matchesPattern(/\w+5A/i);
			});

			it('should match strings correctly', () => {
				__.assertThat(sut.matches('word5A'), __.is(true));
				__.assertThat(sut.matches('word5a'), __.is(true));
				__.assertThat(sut.matches('x5A'), __.is(true));

				__.assertThat(sut.matches('x5'), __.is(false));
				__.assertThat(sut.matches('5A'), __.is(false));
			});

			it('should not match non-strings', () => {
				__.assertThat(sut.matches(), __.is(false));
				__.assertThat(sut.matches(5), __.is(false));
			});

			describe('description', () => {
				let description;

				beforeEach(() => {
					description = new __.Description();
				});

				it('should contain expression', () => {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('a string matching /\\w+5A/i'));
				});

				it('should contain mismatched string', () => {

					sut.describeMismatch('another value', description);

					__.assertThat(description.get(), __.equalTo('was "another value"'));
				});

				it('should contain non-string values', () => {

					sut.describeMismatch({an: 'object'}, description);

					__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
				});
			});
		});

		describe('with string pattern', () => {
			let sut;

			beforeEach(() => {
				sut = __.matchesPattern('\\w+5A');
			});

			it('should match strings correctly ', () => {
				__.assertThat(sut.matches('word5A'), __.is(true));
				__.assertThat(sut.matches('x5A'), __.is(true));

				__.assertThat(sut.matches('word5a'), __.is(false));
				__.assertThat(sut.matches('x5'), __.is(false));
				__.assertThat(sut.matches('5A'), __.is(false));
			});

			it('should not match non-strings', () => {
				__.assertThat(sut.matches(), __.is(false));
				__.assertThat(sut.matches(5), __.is(false));
			});

			describe('description', () => {
				let description;

				beforeEach(() => {
					description = new __.Description();
				});

				it('should contain expression', () => {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('a string matching /\\w+5A/'));
				});

				it('should contain mismatched string', () => {

					sut.describeMismatch('another value', description);

					__.assertThat(description.get(), __.equalTo('was "another value"'));
				});

				it('should contain non-string values', () => {

					sut.describeMismatch({an: 'object'}, description);

					__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
				});
			});
		});
	});
});
