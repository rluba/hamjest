'use strict';

var _ = require('lodash');
var __ = require('../../..');

describe('inRange', function () {

	describe('with a single parameter', function () {
		var sut;
		beforeEach(function () {
			sut = __.inRange(5);
		});

		_.forEach([
			0, 1, 3, 4, 4.9
		], function (value) {
			it('should match values in range [0, param): ' + value, function () {
				__.assertThat(sut.matches(value), __.is(true));
			});
		});

		_.forEach([
			-0.5, 5, 5.1
		], function (value) {
			it('should not match values outside range [0, param): ' + value, function () {
				__.assertThat(sut.matches(value), __.is(false));
			});
		});

		_.forEach([
			null,
			undefined,
			''
		], function (value) {
			it('should not match non-numbers values: ' + value, function () {
				__.assertThat(sut.matches(value), __.is(false));
			});
		});

		describe('description', function () {
			var description;
			beforeEach(function () {
				description = new __.Description();
			});

			it('should include range', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a number in range [0, 5)'));
			});

			it('should contain mismatched value', function () {

				sut.describeMismatch(0, description);

				__.assertThat(description.get(), __.equalTo('was <0>'));
			});
		});
	});

	describe('with two parameters', function () {
		var sut;
		beforeEach(function () {
			sut = __.inRange(3, 5.1);
		});

		_.forEach([
			3, 4, 4.9, 5, 5.01
		], function (value) {
			it('should match values in range [a, b): ' + value, function () {
				__.assertThat(sut.matches(value), __.is(true));
			});
		});

		_.forEach([
			2.9, 5.1
		], function (value) {
			it('should not match values outside range [a, b): ' + value, function () {
				__.assertThat(sut.matches(value), __.is(false));
			});
		});

		_.forEach([
			null,
			undefined,
			''
		], function (value) {
			it('should not match non-numbers values: ' + value, function () {
				__.assertThat(sut.matches(value), __.is(false));
			});
		});

		describe('description', function () {
			var description;
			beforeEach(function () {
				description = new __.Description();
			});

			it('should include range', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a number in range [3, 5.1)'));
			});

			it('should contain mismatched value', function () {

				sut.describeMismatch(0, description);

				__.assertThat(description.get(), __.equalTo('was <0>'));
			});
		});
	});
});
