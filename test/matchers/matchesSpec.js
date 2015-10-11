'use strict';

var _ = require('lodash');
var __ = require('../..');

describe('matches(value)', function () {
	_.forEach([
		[__.containsString('X'), 'eXtreme', true],
		[__.containsString('X'), 'weak', false],
		[__.number(), 5, true],
		[__.number(), 'stringy', false]
	], function (args) {
		var actualMatcher = args[0];
		var value = args[1];
		var matchResult = args[2];
		it('should only match if the actual matcher matches the given value: ' + [__.describe(actualMatcher), value, matchResult].join(' / '), function () {
			var sut = __.matches(value);

			__.assertThat(sut.matches(actualMatcher), __.is(matchResult));
		});
	});

	describe('description', function () {
		var description;
		beforeEach(function () {
			description = new __.Description();
		});

		it('should contain value', function () {
			var sut = __.matches(5);

			sut.describeTo(description);

			__.assertThat(description.get(), __.equalTo('a matcher matching <5>'));
		});

		it('should contain description and mismatch description of the given matcher', function () {
			var sut = __.matches([1, 2]);

			sut.describeMismatch(__.hasSize(3), description);

			__.assertThat(description.get(), __.equalTo('matcher with description "a collection or string with size <3>" failed to match and explained: "size was <2>\\nfor [<1>, <2>]"'));
		});
	});
});
