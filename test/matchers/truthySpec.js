'use strict';

var _ = require('lodash');
var __ = require('../../lib/hamjest');
var Description = require('../../lib/Description');

describe('truthy', function () {
	var sut;
	beforeEach(function () {
		sut = __.truthy();
	});

	_.forEach([
		true,
		'a string',
		5,
		[],
		{}
	], function (value) {
		it('should match truthy values: ' + value, function () {
			__.assertThat(sut.matches(value), __.is(true));
		});
	});

	_.forEach([
		false,
		null,
		undefined,
		''
	], function (value) {
		it('should not match falsy values: ' + value, function () {
			__.assertThat(sut.matches(value), __.is(false));
		});
	});

	describe('description', function () {
		var description;

		beforeEach(function () {
			description = new Description();
		});

		it('should be concise', function () {

			sut.describeTo(description);

			__.assertThat(description.get(), __.equalTo('truthy value'));
		});

		it('should contain mismatched value', function () {

			sut.describeMismatch(0, description);

			__.assertThat(description.get(), __.equalTo('was <0>'));
		});
	});
});
