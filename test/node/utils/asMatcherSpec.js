'use strict';

const __ = require('../../..');
const assertTrue = require('../asserts').assertTrue;
const assertEquals = require('../asserts').assertEquals;
const TestMatcher = require('../TestMatcher');

describe('asMatcher', () => {
	it('should return matchers unchanged', () => {
		const aMatcher = new TestMatcher();

		const resultMatcher = __.asMatcher(aMatcher);

		assertEquals(resultMatcher, aMatcher);
	});

	it('should wrap values in equalTo matchers', () => {
		const value = {member: 'a member value'};

		const resultMatcher = __.asMatcher(value);

		assertTrue(__.isMatcher(resultMatcher), 'Should wrap value');
		assertTrue(resultMatcher.matches({member: 'a member value'}));
	});
});
