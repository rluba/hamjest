'use strict';

const AssertionError = require('assertion-error');
const __ = require('../../..');
const assertTrue = require('../asserts').assertTrue;
const assertFalse = require('../asserts').assertFalse;
const zoo = require('../zoo');

const Animal = zoo.Animal;
const Rodent = zoo.Rodent;
const Squirrel = zoo.Squirrel;

describe('IsInstanceOf', () => {

	describe('instanceOf', () => {
		let sut;
		beforeEach(() => {
			sut = __.instanceOf(Rodent);
		});

		it('should throw for non-function arguments', () => {
			__.assertThat(() => {
				__.instanceOf('a value');
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match instances and subinstances', () => {
			assertFalse(sut.matches(new Animal()));
			assertTrue(sut.matches(new Rodent()));
			assertTrue(sut.matches(new Squirrel()));
		});

		it('should not match undefined', () => {

			assertFalse(sut.matches(undefined));
		});

		describe('description', () => {
			let description;

			beforeEach(() => {
				description = new __.Description();
			});

			it('should contain instance name', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('an instance of Rodent'));
			});

			it('should insert placeholder for anonymous functions', () => {
				sut = __.instanceOf(() => {});

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('an instance of ANONYMOUS FUNCTION'));
			});

			it('should contain mismatched type', () => {

				sut.describeMismatch('another value', description);

				__.assertThat(description.get(), __.equalTo('"another value" is a String'));
			});

			it('should handle undefined value', () => {

				sut.describeMismatch(undefined, description);

				__.assertThat(description.get(), __.equalTo('was undefined'));
			});

			it('should contain mismatched type for custom types', () => {

				sut.describeMismatch(new Animal(), description);

				__.assertThat(description.get(), __.equalTo('{} is a Animal'));
			});
		});
	});
});
