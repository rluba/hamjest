'use strict';

var __ = require('../../lib/hamjest');
var assertTrue = require('../asserts').assertTrue;
var assertEquals = require('../asserts').assertEquals;
var TestMatcher = require('../TestMatcher');

describe('acceptingMatcher', function () {
	var acceptingMatcher = __.acceptingMatcher;

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
