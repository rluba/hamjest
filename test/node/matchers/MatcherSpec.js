'use strict';

const assert = require('assert');

const __ = require('../../..');

describe('Matcher', () => {

	describe('isMatcher', () => {

		it('returns true for Matchers', () => {
			assert.ok(__.isMatcher(new __.Matcher()));
			assert.ok(__.isMatcher(__.equalTo('a value')));
		});

		it('requires all methods', () => {
			assert.equal(__.isMatcher({
				matches: () => {},
				describeTo: () => {}
			}), false);
			assert.equal(__.isMatcher({
				matches: () => {},
				describeMismatch: () => {}
			}), false);
			assert.equal(__.isMatcher({
				describeTo: () => {},
				describeMismatch: () => {}
			}), false);
			assert.equal(__.isMatcher({
				matches: () => {},
				describeTo: 'not a function',
				describeMismatch: () => {}
			}), false);

			assert.ok(__.isMatcher({
				matches: () => {},
				describeTo: () => {},
				describeMismatch: () => {}
			}));
		});

		it('should return false for null', () => {
			assert.equal(__.isMatcher(null), false);
		});

		it('should return false for undefined', () => {
			assert.equal(__.isMatcher(undefined), false);
		});

		it('should return false for arrays', () => {
			assert.equal(__.isMatcher([]), false);
		});
	});
});
