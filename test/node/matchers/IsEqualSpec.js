'use strict';

var _ = require('lodash');
var __ = require('../../..');
var assertTrue = require('../asserts').assertTrue;
var assertFalse = require('../asserts').assertFalse;

describe('IsEqual', function () {

	describe('equalTo', function () {
		it('should match same strings', function () {

			var matcher = __.equalTo('a string');

			assertTrue(matcher.matches('a string'));
		});

		it('should not match unequal strings', function () {
			var matcher = __.equalTo('a string');

			assertFalse(matcher.matches('another string'));
		});

		it('should not coerce', function () {
			var matcher = __.equalTo('2');

			assertFalse(matcher.matches(2));
		});

		it('should match different but equivalent objects', function () {
			var value = {a: 1, b: 2};
			var equivalentValue = _.assign({}, value);

			var matcher = __.equalTo(value);

			assertTrue(matcher.matches(equivalentValue));
		});

		it('should not match unequivalent objects', function () {
			var value = {a: 1, b: 2};

			var matcher = __.equalTo(value);

			assertFalse(matcher.matches({a: 1, b: 3}));
			assertFalse(matcher.matches({a: 1}));
			assertFalse(matcher.matches({a: 1, b: 2, c: 3}));
		});

		it('should match undefined values', function () {
			var anUndefinedVariable;
			var another;

			var matcher = __.equalTo(anUndefinedVariable);

			assertTrue(matcher.matches(another));
		});

		it('should describe as value', function () {
			var description = new __.Description();

			var matcher = __.equalTo('a value');
			matcher.describeTo(description);

			__.assertThat(description.get(), __.equalTo('"a value"'));
		});
	});
});
