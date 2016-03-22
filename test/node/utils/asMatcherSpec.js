'use strict';

var __ = require('../../..');
var assertTrue = require('../asserts').assertTrue;
var assertEquals = require('../asserts').assertEquals;
var TestMatcher = require('../TestMatcher');

describe('asMatcher', function () {
	it('should return matchers unchanged', function () {
		var aMatcher = new TestMatcher();

		var resultMatcher = __.asMatcher(aMatcher);

		assertEquals(resultMatcher, aMatcher);
	});

	it('should wrap values in equalTo matchers', function () {
		var value = {member: 'a member value'};

		var resultMatcher = __.asMatcher(value);

		assertTrue(__.isMatcher(resultMatcher), 'Should wrap value');
		assertTrue(resultMatcher.matches({member: 'a member value'}));
	});
});
