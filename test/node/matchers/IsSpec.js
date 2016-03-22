'use strict';

const __ = require('../../..');
const assertTrue = require('../asserts').assertTrue;
const assertFalse = require('../asserts').assertFalse;

describe('Is', () => {

	describe('is', () => {
		it('should delegate matching', () => {

			const matcher = __.is(__.containsString('expected'));

			assertTrue(matcher.matches('expected value'));
			assertFalse(matcher.matches('another value'));
		});

		it('should wrap values in equalTo matchers', () => {

			const matcher = __.is({a: 'value'});

			assertTrue(matcher.matches({a: 'value'}));
			assertFalse(matcher.matches({another: 'value'}));
		});

		it('should expand on inner description', () => {
			const description = new __.Description();

			const matcher = __.is(__.containsString('a value'));
			matcher.describeTo(description);

			__.assertThat(description.get(), __.equalTo('is a string containing "a value"'));
		});

		it('should delegate mismatch description', () => {
			const description = new __.Description();

			const matcher = __.is(__.containsString('a value'));
			matcher.describeMismatch(7, description);

			__.assertThat(description.get(), __.equalTo('was a Number (<7>)'));
		});
	});
});
