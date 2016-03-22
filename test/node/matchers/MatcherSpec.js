'use strict';

const __ = require('../../..');
const assertTrue = require('../asserts').assertTrue;
const assertFalse = require('../asserts').assertFalse;

describe('Matcher', () => {

	describe('isMatcher', () => {

		it('returns true for Matchers', () => {
			assertTrue(__.isMatcher(new __.Matcher()));
			assertTrue(__.isMatcher(__.equalTo('a value')));
		});

		it('requires all methods', () => {
			assertFalse(__.isMatcher({
				matches: () => {},
				describeTo: () => {}
			}));
			assertFalse(__.isMatcher({
				matches: () => {},
				describeMismatch: () => {}
			}));
			assertFalse(__.isMatcher({
				describeTo: () => {},
				describeMismatch: () => {}
			}));
			assertFalse(__.isMatcher({
				matches: () => {},
				describeTo: 'not a function',
				describeMismatch: () => {}
			}));

			assertTrue(__.isMatcher({
				matches: () => {},
				describeTo: () => {},
				describeMismatch: () => {}
			}));
		});

		it('should return false for null', () => {
			assertFalse(__.isMatcher(null));
		});

		it('should return false for undefined', () => {
			assertFalse(__.isMatcher(undefined));
		});

		it('should return false for arrays', () => {
			assertFalse(__.isMatcher([]));
		});
	});
});
