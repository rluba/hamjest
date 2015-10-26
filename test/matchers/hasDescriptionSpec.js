'use strict';

var _ = require('lodash');
var __ = require('../..');

describe('hasDescription(matcherOrValue)', function () {
	_.forEach([
		[__.hasSize(3), __.containsString('WILL NEVER MATCH'), false],
		[__.hasSize(3), __.containsString('size <3>'), true],
		[__.hasSize(3), 'a collection or string with size <3>', true]
	], function (args) {
		var actualMatcher = args[0];
		var expectedDescription = args[1];
		var matchResult = args[2];
		it('should only match if the description of the actual matcher is as expected: ' + [__.describe(actualMatcher), expectedDescription && __.describe(expectedDescription), matchResult].join(' / '), function () {
			var sut = __.hasDescription(expectedDescription);

			__.assertThat(sut.matches(actualMatcher), __.is(matchResult));
		});
	});

	describe('description', function () {
		var description;
		beforeEach(function () {
			description = new __.Description();
		});

		it('should contain given description matcher\'s description', function () {
			var sut = __.hasDescription(__.containsString('X'));

			sut.describeTo(description);

			__.assertThat(description.get(), __.equalTo('a matcher with description: a string containing \"X\"'));
		});

		it('should contain description of the given matcher if the description differs', function () {
			var sut = __.hasDescription(__.containsString('WILL NEVER MATCH'));

			__.assertThat(sut, __.failsToMatch(__.hasSize(3), 'matcher description was "a collection or string with size <3>"'));
		});
	});
});
