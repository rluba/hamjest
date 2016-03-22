'use strict';

const _ = require('lodash');
const __ = require('../../..');
const assertTrue = require('../asserts').assertTrue;
const assertFalse = require('../asserts').assertFalse;

describe('IsEqual', () => {

	describe('equalTo', () => {
		it('should match same strings', () => {

			const matcher = __.equalTo('a string');

			assertTrue(matcher.matches('a string'));
		});

		it('should not match unequal strings', () => {
			const matcher = __.equalTo('a string');

			assertFalse(matcher.matches('another string'));
		});

		it('should not coerce', () => {
			const matcher = __.equalTo('2');

			assertFalse(matcher.matches(2));
		});

		it('should match different but equivalent objects', () => {
			const value = {a: 1, b: 2};
			const equivalentValue = _.assign({}, value);

			const matcher = __.equalTo(value);

			assertTrue(matcher.matches(equivalentValue));
		});

		it('should not match unequivalent objects', () => {
			const value = {a: 1, b: 2};

			const matcher = __.equalTo(value);

			assertFalse(matcher.matches({a: 1, b: 3}));
			assertFalse(matcher.matches({a: 1}));
			assertFalse(matcher.matches({a: 1, b: 2, c: 3}));
		});

		it('should match undefined values', () => {
			let anUndefinedVariable;
			let another;

			const matcher = __.equalTo(anUndefinedVariable);

			assertTrue(matcher.matches(another));
		});

		it('should describe as value', () => {
			const description = new __.Description();

			const matcher = __.equalTo('a value');
			matcher.describeTo(description);

			__.assertThat(description.get(), __.equalTo('"a value"'));
		});
	});
});
