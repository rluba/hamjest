'use strict';

const assert = require('assert');

const _ = require('lodash');
const hamjest = require('../..');

describe('hamjest', () => {
	it('should not export undefined matchers', () => {
		_.forEach(hamjest, (value, key) => {
			assert.equal(_.isUndefined(value), false, 'Undefined entry for key: ' + key);
		});
	});

	it('should export Description', () => {
		const __ = hamjest;

		__.assertThat(hamjest, __.hasProperty('Description'));
	});

	describe('.describe()', () => {
		it('should allow to fetch the description of a given matcher', () => {
			const __ = hamjest;

			const result = __.describe(__.hasSize(5));

			__.assertThat(result, __.is('a collection or string with size <5>'));
		});
	});
});
