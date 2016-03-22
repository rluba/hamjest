'use strict';

const _ = require('lodash');
const __ = require('../../..');

describe('matches(value)', () => {
	_.forEach([
		[__.containsString('X'), 'eXtreme', true],
		[__.containsString('X'), 'weak', false],
		[__.number(), 5, true],
		[__.number(), 'stringy', false]
	], _.spread((actualMatcher, value, matchResult) => {
		it('should only match if the actual matcher matches the given value: ' + [__.describe(actualMatcher), value, matchResult].join(' / '), () => {
			const sut = __.matches(value);

			__.assertThat(sut.matches(actualMatcher), __.is(matchResult));
		});
	}));

	describe('description', () => {
		let description;
		beforeEach(() => {
			description = new __.Description();
		});

		it('should contain value', () => {
			const sut = __.matches(5);

			sut.describeTo(description);

			__.assertThat(description.get(), __.equalTo('a matcher matching <5>'));
		});

		it('should contain description and mismatch description of the given matcher', () => {
			const sut = __.matches([1, 2]);

			sut.describeMismatch(__.hasSize(3), description);

			__.assertThat(description.get(), __.equalTo('matcher with description "a collection or string with size <3>" failed to match and explained: "size was <2>\nfor [<1>, <2>]"'));
		});
	});
});
