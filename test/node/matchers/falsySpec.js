'use strict';

const _ = require('lodash');
const __ = require('../../..');

describe('falsy', () => {
	let sut;
	beforeEach(() => {
		sut = __.falsy();
	});

	_.forEach([
		[true, 'was true'],
		['a string', 'was "a string"'],
		[5, 'was <5>'],
		[[], 'was []'],
		[{}, 'was {}']
	], _.spread((value, expectedDescription) => {
		it('should not match truthy values: ' + value, () => {
			__.assertThat(sut, __.failsToMatch(value, expectedDescription));
		});
	}));

	_.forEach([
		false,
		null,
		undefined,
		''
	], (value) => {
		it('should match falsy values: ' + value, () => {
			__.assertThat(sut, __.matches(value));
		});
	});

	describe('description', () => {
		it('should be concise', () => {

			__.assertThat(sut, __.hasDescription('falsy value'));
		});
	});
});
