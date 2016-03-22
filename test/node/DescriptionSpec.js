'use strict';

const _ = require('lodash');
const __ = require('../..');
const assertEquals = require('./asserts').assertEquals;

describe('Description', () => {
	let sut;
	beforeEach(() => {
		sut = new __.Description();
	});

	it('should append texts', () => {

		sut.append('a text');
		sut.append('another text');

		assertEquals(sut.get(), 'a textanother text');
	});

	it('should wrap strings in quotes', () => {

		sut.appendValue('a string');

		assertEquals(sut.get(), '"a string"');
	});

	it('should not escape string values', () => {

		sut.appendValue('a string with\nnewlines\n,\ttabs\t,\rcarriage returns\r and "quotes"');

		assertEquals(sut.get(), '"a string with\nnewlines\n,\ttabs\t,\rcarriage returns\r and "quotes""');
	});

	it('should wrap numbers in angular brackets', () => {

		sut.appendValue(5);
		sut.appendValue(2.5);

		assertEquals(sut.get(), '<5><2.5>');
	});

	it('should describe RegExp as pattern', () => {

		sut.appendValue(/a pattern/);

		assertEquals(sut.get(), '/a pattern/');
	});

	it('should describe undefined as "undefined"', () => {

		sut.appendValue(undefined);

		assertEquals(sut.get(), 'undefined');
	});

	it('should describe objects as JSON', () => {

		sut.appendValue({an: 'object'});

		assertEquals(sut.get(), '{"an":"object"}');
	});

	it('should describe at least top-level of recursive objects', () => {
		const recursiveObject = {name: 'recursive'};
		recursiveObject.children = [{name: 'another'}, recursiveObject];

		sut.appendValue(recursiveObject);

		__.assertThat(sut.get(), __.allOf(__.startsWith('{'), __.endsWith('}'), __.containsString('name: "recursive"'), __.containsString('children: ')));
	});

	it('should describe matchers in arrays', () => {
		const matcher = _.create(new __.Matcher(), {
			describeTo: function (description) {
				description.append('a matcher description');
			}
		});

		sut.appendValue([5, matcher, 'foo']);

		assertEquals(sut.get(), '[<5>, a matcher description, "foo"]');
	});

	describe('appendDescriptionOf(matcherOrValue)', () => {
		it('should append matcher description', () => {
			const matcher = _.create(new __.Matcher(), {
				describeTo: function (description) {
					description.append('a matcher description');
				}
			});

			sut.appendDescriptionOf(matcher);

			assertEquals(sut.get(), 'a matcher description');
		});

		_.forEach([
			[5, '<5>'],
			['XX', '"XX"']
		], _.spread((value, expectedDescription) => {
			it('should append value of simple types:' + value, () => {

				sut.appendDescriptionOf(value);

				assertEquals(sut.get(), expectedDescription);
			});
		}));
	});

	it('should show name of functions', () => {
		function aNamedFunction() {
		}

		sut.appendValue(aNamedFunction);

		assertEquals(sut.get(), 'Function aNamedFunction');
	});

	it('should work with anonymous functions', () => {
		sut.appendValue(() => {});

		assertEquals(sut.get(), 'Function');
	});

});
