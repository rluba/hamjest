'use strict';

const assert = require('assert');

const _ = require('lodash');
const __ = require('../../..');

describe('IsSame', () => {

	describe('strictlyEqualTo', () => {
		it('should match same strings', () => {

			const matcher = __.strictlyEqualTo('a string');

			assert.ok(matcher.matches('a string'));
		});

		it('should not match unequal strings', () => {
			const matcher = __.strictlyEqualTo('a string');

			assert.equal(matcher.matches('another string'), false);
		});

		it('should not coerce', () => {
			const matcher = __.strictlyEqualTo('2');

			assert.equal(matcher.matches(2), false);
		});

		it('should not match different but equivalent objects', () => {
			const value = {a: 1, b: 2};
			const equivalentValue = _.assign({}, value);

			const matcher = __.strictlyEqualTo(value);

			assert.equal(matcher.matches(equivalentValue), false);
		});

		it('should match undefined values', () => {
			let anUndefinedVariable;
			let another;

			const matcher = __.strictlyEqualTo(anUndefinedVariable);

			assert.ok(matcher.matches(another));
		});

		it('should describe nicely', () => {
			const description = new __.Description();

			const matcher = __.strictlyEqualTo('a value');
			matcher.describeTo(description);

			__.assertThat(description.get(), __.equalTo('same instance ("a value")'));
		});
	});
});
