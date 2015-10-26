'use strict';

var _ = require('lodash');
var __ = require('../lib/hamjest');
var Description = require('../lib/Description');
var Matcher = require('../lib/matchers/Matcher');
var assertEquals = require('./asserts').assertEquals;

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

	it('should not escape string values', function () {

		sut.appendValue('a string with\nnewlines\n,\ttabs\t,\rcarriage returns\r and "quotes"');

		assertEquals(sut.get(), '"a string with\nnewlines\n,\ttabs\t,\rcarriage returns\r and "quotes""');
	});

	it('should wrap numbers in angular brackets', function () {

		sut.appendValue(5);
		sut.appendValue(2.5);

		assertEquals(sut.get(), '<5><2.5>');
	});

	it('should describe RegExp as pattern', function () {

		sut.appendValue(/a pattern/);

		assertEquals(sut.get(), '/a pattern/');
	});

	it('should describe undefined as "undefined"', function () {

		sut.appendValue(undefined);

		assertEquals(sut.get(), 'undefined');
	});

	it('should describe objects as JSON', function () {

		sut.appendValue({an: 'object'});

		assertEquals(sut.get(), '{"an":"object"}');
	});

	it('should describe at least top-level of recursive objects', function () {
		var recursiveObject = {name: 'recursive'};
		recursiveObject.children = [{name: 'another'}, recursiveObject];

		sut.appendValue(recursiveObject);

		__.assertThat(sut.get(), __.allOf(__.startsWith('{'), __.endsWith('}'), __.containsString('name: "recursive"'), __.containsString('children: ')));
	});

	it('should describe matchers in arrays', function () {
		var matcher = _.create(new Matcher(), {
			describeTo: function (description) {
				description.append('a matcher description');
			}
		});

		sut.appendValue([5, matcher, 'foo']);

		assertEquals(sut.get(), '[<5>, a matcher description, "foo"]');
	});

	describe('appendDescriptionOf(matcherOrValue)', function () {
		it('should append matcher description', function () {
			var matcher = _.create(new Matcher(), {
				describeTo: function (description) {
					description.append('a matcher description');
				}
			});

			sut.appendDescriptionOf(matcher);

			assertEquals(sut.get(), 'a matcher description');
		});

		// TODO: Parameterize with more values
		it('should append value of simple types', function () {

			sut.appendDescriptionOf(5);

			assertEquals(sut.get(), '<5>');
		});
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
