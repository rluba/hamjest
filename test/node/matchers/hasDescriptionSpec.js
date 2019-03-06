'use strict';

const _ = require('lodash');
const __ = require('../../..');

describe('hasDescription(valueOrMatcher)', () => {
	_.forEach([
		[__.hasSize(3), __.containsString('WILL NEVER MATCH'), false],
		[__.hasSize(3), __.containsString('size <3>'), true],
		[__.hasSize(3), 'a collection or string with size <3>', true]
	], _.spread((actualMatcher, expectedDescription, matchResult) => {
		it('should only match if the description of the actual matcher is as expected: ' + [__.describe(actualMatcher), __.describe(expectedDescription), matchResult].join(' / '), () => {
			const sut = __.hasDescription(expectedDescription);

			__.assertThat(sut.matches(actualMatcher), __.is(matchResult));
		});
	}));

	describe('description', () => {
		let description;
		beforeEach(() => {
			description = new __.Description();
		});

		it('should contain given description matcher\'s description', () => {
			const sut = __.hasDescription(__.containsString('X'));

			sut.describeTo(description);

			__.assertThat(description.get(), __.equalTo('a matcher with description: a string containing \"X\"'));
		});

		it('should contain description of the given matcher if the description differs', () => {
			const sut = __.hasDescription(__.containsString('WILL NEVER MATCH'));

			__.assertThat(sut, __.failsToMatch(__.hasSize(3), 'matcher description was "a collection or string with size <3>"'));
		});
	});
});
