'use strict';

var _ = require('lodash')
	,TypeSafeMatcher = require('../../lib/matchers/TypeSafeMatcher')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	;

describe('TypeSafeMatcher', function () {
	var sut;

	beforeEach(function () {
		sut = _.create(new TypeSafeMatcher(), {
			isExpectedType: function () {
				return false;
			},
			machesSafely: function () {
				return false;
			}
		});
	});

	describe('description', function () {
		var description;

		beforeEach(function () {
			description = new Description();
		});

		it('should describe undefined as "undefined"', function () {

			sut.describeMismatch(undefined, description);

			__.assertThat(description.get(), __.equalTo('was undefined'));
		});

		it('should describe null as "null"', function () {

			sut.describeMismatch(null, description);

			__.assertThat(description.get(), __.equalTo('was null'));
		});
	});
});
