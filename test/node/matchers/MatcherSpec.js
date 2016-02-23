'use strict';

var __ = require('../../..');
var assertTrue = require('../asserts').assertTrue;
var assertFalse = require('../asserts').assertFalse;

describe('Matcher', function () {

	describe('isMatcher', function () {

		it('returns true for Matchers', function () {
			assertTrue(__.isMatcher(new __.Matcher()));
			assertTrue(__.isMatcher(__.equalTo('a value')));
		});

		it('requires all methods', function () {
			assertFalse(__.isMatcher({
				matches: function () {},
				describeTo: function () {}
			}));
			assertFalse(__.isMatcher({
				matches: function () {},
				describeMismatch: function () {}
			}));
			assertFalse(__.isMatcher({
				describeTo: function () {},
				describeMismatch: function () {}
			}));
			assertFalse(__.isMatcher({
				matches: function () {},
				describeTo: 'not a function',
				describeMismatch: function () {}
			}));

			assertTrue(__.isMatcher({
				matches: function () {},
				describeTo: function () {},
				describeMismatch: function () {}
			}));
		});

		it('should return false for null', function () {
			assertFalse(__.isMatcher(null));
		});

		it('should return false for undefined', function () {
			assertFalse(__.isMatcher(undefined));
		});

		it('should return false for arrays', function () {
			assertFalse(__.isMatcher([]));
		});
	});
});
