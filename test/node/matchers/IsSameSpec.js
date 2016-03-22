'use strict';

const _ = require('lodash');
const __ = require('../../..');
const assertTrue = require('../asserts').assertTrue;
const assertFalse = require('../asserts').assertFalse;

describe('IsSame', () => {

	describe('strictlyEqualTo', () => {
		it('should match same strings', () => {

			const matcher = __.strictlyEqualTo('a string');

			assertTrue(matcher.matches('a string'));
		});

		it('should not match unequal strings', () => {
			const matcher = __.strictlyEqualTo('a string');

			assertFalse(matcher.matches('another string'));
		});

		it('should not coerce', () => {
			const matcher = __.strictlyEqualTo('2');

			assertFalse(matcher.matches(2));
		});

		it('should not match different but equivalent objects', () => {
			const value = {a: 1, b: 2};
			const equivalentValue = _.assign({}, value);

			const matcher = __.strictlyEqualTo(value);

			assertFalse(matcher.matches(equivalentValue));
		});

		it('should match undefined values', () => {
			let anUndefinedVariable;
			let another;

			const matcher = __.strictlyEqualTo(anUndefinedVariable);

			assertTrue(matcher.matches(another));
		});

		it('should describe nicely', () => {
			const description = new __.Description();

			const matcher = __.strictlyEqualTo('a value');
			matcher.describeTo(description);

			__.assertThat(description.get(), __.equalTo('same instance ("a value")'));
		});
	});
});
