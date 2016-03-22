'use strict';

const assert = require('assert');

const __ = require('../../..');
const TestMatcher = require('../TestMatcher');

describe('asMatcher', () => {
	it('should return matchers unchanged', () => {
		const aMatcher = new TestMatcher();

		const resultMatcher = __.asMatcher(aMatcher);

		assert.equal(resultMatcher, aMatcher);
	});

	it('should wrap values in equalTo matchers', () => {
		const value = {member: 'a member value'};

		const resultMatcher = __.asMatcher(value);

		assert.ok(__.isMatcher(resultMatcher), 'Should wrap value');
		assert.ok(resultMatcher.matches({member: 'a member value'}));
	});
});
