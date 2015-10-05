'use strict';

var __ = require('../../lib/hamjest');
var assertTrue = require('../asserts').assertTrue;
var assertEquals = require('../asserts').assertEquals;
var TestMatcher = require('../TestMatcher');

describe('asMatcher', function () {
	var asMatcher = __.asMatcher;

	it('should return matchers unchanged', function () {
		var aMatcher = new TestMatcher();

		var resultMatcher = asMatcher(aMatcher);

		assertEquals(resultMatcher, aMatcher);
	});

	it('should wrap values in equalTo matchers', function () {
		var value = {member: 'a member value'};

		var resultMatcher = asMatcher(value);

		assertTrue(__.isMatcher(resultMatcher), 'Should wrap value');
		assertTrue(resultMatcher.matches({member: 'a member value'}));
	});
});
