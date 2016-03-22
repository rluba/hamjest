'use strict';

const assert = require('assert');

const __ = require('../../..');

describe('IsNot', () => {

	describe('not', () => {
		let innerMatcher;
		beforeEach(() => {
			innerMatcher = __.containsString('expected');
		});

		it('should delegate matching and invert result', () => {

			const matcher = __.not(innerMatcher);

			assert.equal(matcher.matches('expected value'), false);
			assert.ok(matcher.matches('another value'));
		});

		it('should wrap values in equalTo matchers', () => {

			const matcher = __.not({a: 'value'});

			assert.equal(matcher.matches({a: 'value'}), false);
			assert.ok(matcher.matches({another: 'value'}));
		});

		it('should expand on inner description', () => {
			const description = new __.Description();

			const matcher = __.not(innerMatcher);
			matcher.describeTo(description);

			__.assertThat(description.get(), __.equalTo('not a string containing "expected"'));
		});

		it('should describe mismatching value', () => {
			const description = new __.Description();

			const matcher = __.not(__.hasProperties({foo: 'bar'}));
			matcher.describeMismatch({foo: 'bar'}, description);

			__.assertThat(description.get(), __.equalTo('was {"foo":"bar"}'));
		});
	});
});
