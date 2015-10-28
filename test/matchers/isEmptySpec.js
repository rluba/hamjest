'use strict';

var _ = require('lodash');
var isEmpty = require('../../lib/matchers/isEmpty')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	;

describe('isEmptySpec', function () {

	var sut;
	beforeEach(function () {
		sut = isEmpty();
	});

	_.forEach([
		{given: [], expected: true},
		{given: ['a'], expected: false}
	], function (params) {
		it('should match arrays: ' + params.given, function () {

			__.assertThat(sut.matches(params.given), __.is(params.expected));
		});
	});

	_.forEach([
		{given: {}, expected: true},
		{given: {a: '1'}, expected: false}
	], function (params) {
		it('should match objects: ' + params.given, function () {

			__.assertThat(sut.matches(params.given), __.is(params.expected));
		});
	});

	_.forEach([
		{given: '', expected: true},
		{given: 'x', expected: false},
		{given: 'a long string', expected: false}
	], function (params) {
		it('should match strings: ' + params.given, function () {

			__.assertThat(sut.matches(params.given), __.is(params.expected));
		});
	});

	_.forEach([
		12,
		0,
		-1
	], function (given) {
		it('should not match numbers: ' + given, function () {

			__.assertThat(sut.matches(given), __.is(false));
		});
	});

	describe('description', function () {
		var description;

		beforeEach(function () {
			description = new Description();
		});

		it('should contain simple description', function () {

			sut.describeTo(description);

			__.assertThat(description.get(), __.equalTo('an empty collection or string'));
		});

		it('should contain mismatched value and size', function () {

			sut.describeMismatch(['a'], description);

			__.assertThat(description.get(), __.equalTo('size was <1>\nfor ["a"]'));
		});

		it('should fit for non-arrays', function () {

			sut.describeMismatch(7, description);

			__.assertThat(description.get(), __.equalTo('was a Number (<7>)'));
		});
	});
});
