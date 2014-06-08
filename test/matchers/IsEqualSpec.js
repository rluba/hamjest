'use strict';

var _ = require('lodash')
	, IsEqual = require('../../lib/matchers/IsEqual')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	, assertEquals = require('../asserts').assertEquals
	, TestMatcher = require('../TestMatcher')
	;

describe('IsEqual', function () {

	describe('equalTo', function () {
		var equalTo = IsEqual.equalTo;

		it('should match same strings', function () {

			var matcher = equalTo('a string');

			assertTrue(matcher.matches('a string'));
		});

		it('should not match unequal strings', function () {
			var matcher = equalTo('a string');

			assertFalse(matcher.matches('another string'));
		});

		it('should not coerce', function () {
			var matcher = equalTo('2');

			assertFalse(matcher.matches(2));
		});

		it('should match different but equivalent objects', function () {
			var value = {a: 1, b: 2};
			var equivalentValue = _.assign({}, value);

			var matcher = equalTo(value);

			assertTrue(matcher.matches(equivalentValue));
		});

		it('should not match unequivalent objects', function () {
			var value = {a: 1, b: 2};

			var matcher = equalTo(value);

			assertFalse(matcher.matches({a: 1, b: 3}));
			assertFalse(matcher.matches({a: 1}));
			assertFalse(matcher.matches({a: 1, b: 2, c: 3}));
		});

		it('should match undefined values', function () {
			var anUndefinedVariable;
			var another;

			var matcher = equalTo(anUndefinedVariable);

			assertTrue(matcher.matches(another));
		});

		it('should describe as value', function () {
			var description = new Description();

			var matcher = equalTo('a value');
			matcher.describeTo(description);

			__.assertThat(description.get(), equalTo('"a value"'));
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

			assertTrue(__.isMatcher(resultMatcher), 'Should wrap value');
			assertTrue(resultMatcher.matches({ member: 'a member value' }));
		});
	});

	describe('acceptingMatcher', function () {
		var acceptingMatcher = IsEqual.acceptingMatcher;

		it('should adapt function with asMatcher: with simple values', function () {
			var passedValue;
			var returnValue = 'a return value';
			var aFunction = function (matcher) {
				passedValue = matcher;
				return returnValue;
			};

			var wrappedFunction = acceptingMatcher(aFunction);
			var result = wrappedFunction('not a matcher');

			assertTrue(__.isMatcher(passedValue));
			__.assertThat(result, __.equalTo(returnValue));
		});

		it('should adapt function with asMatcher: with matcher', function () {
			var passedValue;
			var returnValue = 'a return value';
			var aFunction = function (matcher) {
				passedValue = matcher;
				return returnValue;
			};
			var aMatcher = new TestMatcher();

			var wrappedFunction = acceptingMatcher(aFunction);
			var result = wrappedFunction(aMatcher);

			assertEquals(passedValue, aMatcher);
			__.assertThat(result, __.equalTo(returnValue));
		});
	});
});
