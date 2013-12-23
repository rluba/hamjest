'use strict';

var IsEqual = require('../../lib/matchers/IsEqual')
	, Description = require('../../lib/Description')
	, hamjest = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	, assertEquals = require('../asserts').assertEquals
	, TestMatcher = require('../TestMatcher')
	;

describe('IsEqual', function () {

	describe('equalTo', function () {
		var equalTo = IsEqual.equalTo;

		it('should match same strings', function () {
			assertTrue(equalTo('a string').matches('a string'));
		});

		it('should not match different strings', function () {
			assertFalse(equalTo('a string').matches('another string'));
		});

		it('should not match strings and numbers', function () {
			assertFalse(equalTo('2').matches(2));
		});

		it('should match different but equivalent objects', function () {
			assertTrue(equalTo({a: 1, b: 2}).matches({a: 1, b: 2}));
		});

		it('should not match unequivalent objects', function () {
			assertFalse(equalTo({a: 1, b: 2}).matches({a: 1, b: 3}));
			assertFalse(equalTo({a: 1, b: 2}).matches({a: 1}));
			assertFalse(equalTo({a: 1, b: 2}).matches({a: 1, b: 2, c: 3}));
		});

		it('should match undefined values', function () {
			var a;
			var b;

			assertTrue(equalTo(a).matches(b));
		});

		it('should describe as value', function () {
			var description = new Description();

			equalTo('a value').describeTo(description);

			assertEquals(description.get(), '"a value"');
		});

	});

	describe('asMatcher', function () {
		var asMatcher = IsEqual.asMatcher;

		it('should return matchers unchanged', function () {
			var aMatcher = new TestMatcher();

			var resultMatcher = asMatcher(aMatcher);

			assertEquals(resultMatcher, aMatcher);
		});

		it('should wrap values in equalTo matchers', function () {
			var value = { member: 'a member value' };

			var resultMatcher = asMatcher(value);

			assertTrue(hamjest.isMatcher(resultMatcher), 'Should wrap value');
			assertTrue(resultMatcher.matches({ member: 'a member value' }));
		});
	});

	describe('acceptingMatcher', function () {
		var acceptingMatcher = IsEqual.acceptingMatcher;

		it('should adapt function with asMatcher: with simple values', function () {
			var passedValue;
			var aFunction = function (matcher) {
				passedValue = matcher;
			};

			var wrappedFunction = acceptingMatcher(aFunction);
			wrappedFunction('not a matcher');

			assertTrue(hamjest.isMatcher(passedValue));
		});

		it('should adapt function with asMatcher: with matcher', function () {
			var passedValue;
			var aFunction = function (matcher) {
				passedValue = matcher;
			};
			var aMatcher = new TestMatcher();

			var wrappedFunction = acceptingMatcher(aFunction);
			wrappedFunction(aMatcher);

			assertEquals(passedValue, aMatcher);
		});
	});

});
