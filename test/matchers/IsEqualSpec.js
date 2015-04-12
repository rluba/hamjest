'use strict';

var _ = require('lodash')
	, IsEqual = require('../../lib/matchers/IsEqual')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	;

describe('IsEqual', function () {

	describe('equalTo', function () {
		var equalTo = IsEqual.equalTo;

		it('should match same strings', function () {

			var matcher = equalTo('a string');

			assertTrue(matcher.matches('a string'));
		});

		it('should not match unequal strings', function () {
			var matcher = equalTo('a string');

			assertFalse(matcher.matches('another string'));
		});

		it('should not coerce', function () {
			var matcher = equalTo('2');

			assertFalse(matcher.matches(2));
		});

		it('should match different but equivalent objects', function () {
			var value = {a: 1, b: 2};
			var equivalentValue = _.assign({}, value);

			var matcher = equalTo(value);

			assertTrue(matcher.matches(equivalentValue));
		});

		it('should not match unequivalent objects', function () {
			var value = {a: 1, b: 2};

			var matcher = equalTo(value);

			assertFalse(matcher.matches({a: 1, b: 3}));
			assertFalse(matcher.matches({a: 1}));
			assertFalse(matcher.matches({a: 1, b: 2, c: 3}));
		});

		it('should match undefined values', function () {
			var anUndefinedVariable;
			var another;

			var matcher = equalTo(anUndefinedVariable);

			assertTrue(matcher.matches(another));
		});

		it('should describe as value', function () {
			var description = new Description();

			var matcher = equalTo('a value');
			matcher.describeTo(description);

			__.assertThat(description.get(), equalTo('"a value"'));
		});
	});
});
