'use strict';

var _ = require('lodash');
var __ = require('../../lib/hamjest');
var Description = require('../../lib/Description');

describe('falsy', function () {
	var sut;
	beforeEach(function () {
		sut = __.falsy();
	});

	_.forEach([
		true,
		'a string',
		5,
		[],
		{}
	], function (value) {
		it('should not match truthy values: ' + value, function () {
			__.assertThat(sut.matches(value), __.is(false));
		});
	});

	_.forEach([
		false,
		null,
		undefined,
		''
	], function (value) {
		it('should match falsy values: ' + value, function () {
			__.assertThat(sut.matches(value), __.is(true));
		});
	});

	describe('description', function () {
		var description;

		beforeEach(function () {
			description = new Description();
		});

		it('should be concise', function () {

			sut.describeTo(description);

			__.assertThat(description.get(), __.equalTo('falsy value'));
		});

		it('should contain mismatched value', function () {

			sut.describeMismatch(5, description);

			__.assertThat(description.get(), __.equalTo('was <5>'));
		});
	});
});
