'use strict';

var _ = require('lodash');
var __ = require('../../..');
var assertTrue = require('../asserts').assertTrue;
var assertFalse = require('../asserts').assertFalse;

describe('IsSame', function () {

	describe('strictlyEqualTo', function () {
		it('should match same strings', function () {

			var matcher = __.strictlyEqualTo('a string');

			assertTrue(matcher.matches('a string'));
		});

		it('should not match unequal strings', function () {
			var matcher = __.strictlyEqualTo('a string');

			assertFalse(matcher.matches('another string'));
		});

		it('should not coerce', function () {
			var matcher = __.strictlyEqualTo('2');

			assertFalse(matcher.matches(2));
		});

		it('should not match different but equivalent objects', function () {
			var value = {a: 1, b: 2};
			var equivalentValue = _.assign({}, value);

			var matcher = __.strictlyEqualTo(value);

			assertFalse(matcher.matches(equivalentValue));
		});

		it('should match undefined values', function () {
			var anUndefinedVariable;
			var another;

			var matcher = __.strictlyEqualTo(anUndefinedVariable);

			assertTrue(matcher.matches(another));
		});

		it('should describe nicely', function () {
			var description = new __.Description();

			var matcher = __.strictlyEqualTo('a value');
			matcher.describeTo(description);

			__.assertThat(description.get(), __.equalTo('same instance ("a value")'));
		});
	});
});
