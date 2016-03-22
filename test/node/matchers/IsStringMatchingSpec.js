'use strict';

var AssertionError = require('assertion-error');
var __ = require('../../..');

describe('IsStringMatching', function () {

	describe('matchesPattern', function () {
		it('should throw for non-string, non-RegExp arguments', function () {
			__.assertThat(function () {
				__.matchesPattern(7);
			}, __.throws(__.instanceOf(AssertionError)));
		});

		describe('with RegExp', function () {
			var sut;

			beforeEach(function () {
				sut = __.matchesPattern(/\w+5A/i);
			});

			it('should match strings correctly', function () {
				__.assertThat(sut.matches('word5A'), __.is(true));
				__.assertThat(sut.matches('word5a'), __.is(true));
				__.assertThat(sut.matches('x5A'), __.is(true));

				__.assertThat(sut.matches('x5'), __.is(false));
				__.assertThat(sut.matches('5A'), __.is(false));
			});

			it('should not match non-strings', function () {
				__.assertThat(sut.matches(), __.is(false));
				__.assertThat(sut.matches(5), __.is(false));
			});

			describe('description', function () {
				var description;

				beforeEach(function () {
					description = new __.Description();
				});

				it('should contain expression', function () {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('a string matching /\\w+5A/i'));
				});

				it('should contain mismatched string', function () {

					sut.describeMismatch('another value', description);

					__.assertThat(description.get(), __.equalTo('was "another value"'));
				});

				it('should contain non-string values', function () {

					sut.describeMismatch({an: 'object'}, description);

					__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
				});
			});
		});

		describe('with string pattern', function () {
			var sut;

			beforeEach(function () {
				sut = __.matchesPattern('\\w+5A');
			});

			it('should match strings correctly ', function () {
				__.assertThat(sut.matches('word5A'), __.is(true));
				__.assertThat(sut.matches('x5A'), __.is(true));

				__.assertThat(sut.matches('word5a'), __.is(false));
				__.assertThat(sut.matches('x5'), __.is(false));
				__.assertThat(sut.matches('5A'), __.is(false));
			});

			it('should not match non-strings', function () {
				__.assertThat(sut.matches(), __.is(false));
				__.assertThat(sut.matches(5), __.is(false));
			});

			describe('description', function () {
				var description;

				beforeEach(function () {
					description = new __.Description();
				});

				it('should contain expression', function () {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('a string matching /\\w+5A/'));
				});

				it('should contain mismatched string', function () {

					sut.describeMismatch('another value', description);

					__.assertThat(description.get(), __.equalTo('was "another value"'));
				});

				it('should contain non-string values', function () {

					sut.describeMismatch({an: 'object'}, description);

					__.assertThat(description.get(), __.equalTo('was a Object ({"an":"object"})'));
				});
			});
		});
	});
});
