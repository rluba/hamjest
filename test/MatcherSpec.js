'use strict';

var Matcher = require('../lib/Matcher')
	, equalTo = require('../lib/IsEqual').equalTo
	, assertTrue = require('./asserts').assertTrue
	, assertFalse = require('./asserts').assertFalse
	;

describe('Matcher', function () {

	describe('isMatcher', function () {

		it('returns true for Matchers', function () {
			assertTrue(Matcher.isMatcher(new Matcher()));
			assertTrue(Matcher.isMatcher(equalTo('a value')));
		});

		it('requires all methods', function () {
			assertFalse(Matcher.isMatcher({
				matches: function () {},
				describeTo: function () {}
			}));
			assertFalse(Matcher.isMatcher({
				matches: function () {},
				describeMismatch: function () {}
			}));
			assertFalse(Matcher.isMatcher({
				describeTo: function () {},
				describeMismatch: function () {}
			}));
			assertFalse(Matcher.isMatcher({
				matches: function () {},
				describeTo: 'not a function',
				describeMismatch: function () {}
			}));

			assertTrue(Matcher.isMatcher({
				matches: function () {},
				describeTo: function () {},
				describeMismatch: function () {}
			}));
		});
	});
});
