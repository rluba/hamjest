'use strict';

var equalTo = require('../lib/matchers/IsEqual').equalTo
	, Description = require('../lib/Description')
	, assertTrue = require('./asserts').assertTrue
	, assertFalse = require('./asserts').assertFalse
	, assertEquals = require('./asserts').assertEquals
	;

describe('IsEqual', function () {

	it('should match same strings', function () {
		assertTrue(equalTo('a string').matches('a string'));
	});

	it('should not match different strings', function () {
		assertFalse(equalTo('a string').matches('another string'));
	});

	it('should not match strings and numbers', function () {
		assertFalse(equalTo('2').matches(2));
	});

	it('should match different but equivalent objects', function () {
		assertTrue(equalTo({a: 1, b: 2}).matches({a: 1, b: 2}));
	});

	it('should not match unequivalent objects', function () {
		assertFalse(equalTo({a: 1, b: 2}).matches({a: 1, b: 3}));
		assertFalse(equalTo({a: 1, b: 2}).matches({a: 1}));
		assertFalse(equalTo({a: 1, b: 2}).matches({a: 1, b: 2, c: 3}));
	});

	it('should match undefined values', function () {
		var a;
		var b;

		assertTrue(equalTo(a).matches(b));
	});

	it('should describe as value', function () {
		var description = new Description();

		equalTo('a value').describeTo(description);

		assertEquals(description.get(), '"a value"');
	});

});
