'use strict';

const assert = require('assert');

const _ = require('lodash');

const __ = require('../../..');

describe('IsEqual', () => {

	describe('equalTo', () => {
		it('should match same strings', () => {

			const matcher = __.equalTo('a string');

			assert.ok(matcher.matches('a string'));
		});

		it('should not match unequal strings', () => {
			const matcher = __.equalTo('a string');

			assert.equal(matcher.matches('another string'), false);
		});

		it('should not coerce', () => {
			const matcher = __.equalTo('2');

			assert.equal(matcher.matches(2), false);
		});

		it('should match different but equivalent objects', () => {
			const value = {a: 1, b: 2};
			const equivalentValue = _.assign({}, value);

			const matcher = __.equalTo(value);

			assert.ok(matcher.matches(equivalentValue));
		});

		it('should handle 0 === -0 correctly (#23)', () => {

			const matcher = __.equalTo(0);

			assert.ok(matcher.matches(-0));
		});

		it('should not match unequivalent objects', () => {
			const value = {a: 1, b: 2};

			const matcher = __.equalTo(value);

			assert.equal(matcher.matches({a: 1, b: 3}), false);
			assert.equal(matcher.matches({a: 1}), false);
			assert.equal(matcher.matches({a: 1, b: 2, c: 3}), false);
		});

		it('should match undefined values', () => {
			let anUndefinedVariable;
			let another;

			const matcher = __.equalTo(anUndefinedVariable);

			assert.ok(matcher.matches(another));
		});

		it('should describe as value', () => {
			const description = new __.Description();

			const matcher = __.equalTo('a value');
			matcher.describeTo(description);

			__.assertThat(description.get(), __.equalTo('"a value"'));
		});
	});
});
