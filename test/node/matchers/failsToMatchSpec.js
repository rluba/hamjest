'use strict';

const _ = require('lodash');
const __ = require('../../..');

describe('failsToMatch(value)', () => {
	_.forEach([
		[__.hasSize(2), [9, 8], __.anything(), false],
		[__.hasSize(2), [9, 8], undefined, false],
		[__.hasSize(3), [9, 8], undefined, true],
		[__.hasSize(3), [9, 8], __.containsString('WILL NEVER MATCH'), false],
		[__.hasSize(3), [9, 8], __.containsString('size was <2>'), true],
		[__.number(), 5, __.anything(), false],
		[__.number(), 'stringy', __.containsString('WILL NEVER MATCH'), false],
		[__.number(), 'stringy', __.containsString('was'), true]
	], _.spread((actualMatcher, value, expectedDescription, matchResult) => {
		it('should only match if the actual matcher fails to match the given value and the mismatch description is as expected: ' + [__.describe(actualMatcher), value, __.describe(expectedDescription), matchResult].join(' / '), () => {
			const sut = __.failsToMatch(value, expectedDescription);

			__.assertThat(sut.matches(actualMatcher), __.is(matchResult));
		});
	}));

	describe('description', () => {
		let description;
		beforeEach(() => {
			description = new __.Description();
		});

		it('should contain value and description matcher', () => {
			const sut = __.failsToMatch(5, __.containsString('X'));

			sut.describeTo(description);

			__.assertThat(description.get(), __.equalTo('a matcher failing to match <5> with mismatch description "a string containing \"X\""'));
		});

		it('should contain description if matcher matches', () => {
			const sut = __.failsToMatch([1, 2], __.anything());

			sut.describeMismatch(__.hasSize(2), description);

			__.assertThat(description.get(), __.equalTo('matcher with description "a collection or string with size <2>" matched'));
		});

		it('should contain description and mismatch description of the given matcher if the description differs', () => {
			const sut = __.failsToMatch([1, 2], __.containsString('WILL NEVER MATCH'));

			sut.describeMismatch(__.hasSize(3), description);

			__.assertThat(description.get(), __.equalTo('matcher with description "a collection or string with size <3>": mismatch description was "size was <2>\nfor [<1>, <2>]"'));
		});
	});
});
