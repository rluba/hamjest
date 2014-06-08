'use strict';

var _ = require('lodash')
	, IsSame = require('../../lib/matchers/IsSame')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	;

describe('IsSame', function () {

	describe('strictlyEqualTo', function () {
		var strictlyEqualTo = IsSame.strictlyEqualTo;

		it('should match same strings', function () {

			var matcher = strictlyEqualTo('a string');

			assertTrue(matcher.matches('a string'));
		});

		it('should not match unequal strings', function () {
			var matcher = strictlyEqualTo('a string');

			assertFalse(matcher.matches('another string'));
		});

		it('should not coerce', function () {
			var matcher = strictlyEqualTo('2');

			assertFalse(matcher.matches(2));
		});

		it('should not match different but equivalent objects', function () {
			var value = {a: 1, b: 2};
			var equivalentValue = _.assign({}, value);

			var matcher = strictlyEqualTo(value);

			assertFalse(matcher.matches(equivalentValue));
		});

		it('should match undefined values', function () {
			var anUndefinedVariable;
			var another;

			var matcher = strictlyEqualTo(anUndefinedVariable);

			assertTrue(matcher.matches(another));
		});

		it('should describe nicely', function () {
			var description = new Description();

			var matcher = strictlyEqualTo('a value');
			matcher.describeTo(description);

			__.assertThat(description.get(), __.equalTo('same instance ("a value")'));
		});
	});
});
