'use strict';

var Description = require('../lib/Description')
	, Matcher = require('../lib/Matcher')
	, assertEquals = require('./asserts').assertEquals
	;

describe('Description', function () {
	var sut;
	beforeEach(function () {
		sut = new Description();
	});

	it('should append texts', function () {

		sut.append('a text');
		sut.append('another text');

		assertEquals(sut.get(), 'a textanother text');
	});

	it('should wrap strings in quotes', function () {

		sut.appendValue('a string');

		assertEquals(sut.get(), '"a string"');
	});

	it('should describe string values with escaped special characters', function () {

		sut.appendValue('a string with\nnewlines\n,\ttabs\t,\rcarriage returns\r and "quotes"');

		assertEquals(sut.get(), '"a string with\\nnewlines\\n,\\ttabs\\t,\\rcarriage returns\\r and \\"quotes\\""');
	});

	it('should wrap numbers in angular brackets', function () {

		sut.appendValue(5);
		sut.appendValue(2.5);

		assertEquals(sut.get(), '<5><2.5>');
	});

	it('should describe matchers in arrays', function () {
		var matcher = new Matcher({describeTo: function (description) {
			description.append('a matcher description');
		}});

		sut.appendValue([5, matcher, 'foo']);

		assertEquals(sut.get(), '[<5>, a matcher description, "foo"]');
	});

	it('should show name of functions', function () {
		function aNamedFunction() {
		}

		sut.appendValue(aNamedFunction);

		assertEquals(sut.get(), 'Function aNamedFunction');
	});

	it('should work with anonymous functions', function () {
		sut.appendValue(function () {});

		assertEquals(sut.get(), 'Function');
	});

});
