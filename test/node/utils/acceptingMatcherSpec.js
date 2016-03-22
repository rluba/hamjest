'use strict';

const __ = require('../../..');
const assertTrue = require('../asserts').assertTrue;
const assertEquals = require('../asserts').assertEquals;
const TestMatcher = require('../TestMatcher');

describe('acceptingMatcher', () => {
	it('should adapt function with asMatcher: with simple values', () => {
		let passedValue;
		const returnValue = 'a return value';
		const aFunction = function (matcher) {
			passedValue = matcher;
			return returnValue;
		};

		const wrappedFunction = __.acceptingMatcher(aFunction);
		const result = wrappedFunction('not a matcher');

		assertTrue(__.isMatcher(passedValue));
		__.assertThat(result, __.equalTo(returnValue));
	});

	it('should adapt function with asMatcher: with matcher', () => {
		let passedValue;
		const returnValue = 'a return value';
		const aFunction = function (matcher) {
			passedValue = matcher;
			return returnValue;
		};
		const aMatcher = new TestMatcher();

		const wrappedFunction = __.acceptingMatcher(aFunction);
		const result = wrappedFunction(aMatcher);

		assertEquals(passedValue, aMatcher);
		__.assertThat(result, __.equalTo(returnValue));
	});
});
