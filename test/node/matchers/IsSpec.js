'use strict';

const assert = require('assert');

const __ = require('../../..');

describe('Is', () => {

	describe('is', () => {
		it('should delegate matching', () => {

			const matcher = __.is(__.containsString('expected'));

			assert.ok(matcher.matches('expected value'));
			assert.equal(matcher.matches('another value'), false);
		});

		it('should wrap values in equalTo matchers', () => {

			const matcher = __.is({a: 'value'});

			assert.ok(matcher.matches({a: 'value'}));
			assert.equal(matcher.matches({another: 'value'}), false);
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
