'use strict';

var AssertionError = require('assertion-error')
	, IsInstanceOf = require('../../lib/matchers/IsInstanceOf')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	, zoo = require('../zoo')
	;

var Animal = zoo.Animal;
var Rodent = zoo.Rodent;
var Squirrel = zoo.Squirrel;

describe('IsInstanceOf', function () {

	describe('instanceOf', function () {
		var instanceOf = IsInstanceOf.instanceOf;
		var sut;

		beforeEach(function () {
			sut = instanceOf(Rodent);
		});

		it('should throw for non-function arguments', function () {
			__.assertThat(function () {
				instanceOf('a value');
			}, __.throws(__.instanceOf(AssertionError)));
		});

		it('should match instances and subinstances', function () {
			assertFalse(sut.matches(new Animal()));
			assertTrue(sut.matches(new Rodent()));
			assertTrue(sut.matches(new Squirrel()));
		});

		it('should not match undefined', function () {
			var undef;

			assertFalse(sut.matches(undef));
		});

		describe('description', function () {
			var description;

			beforeEach(function () {
				description = new Description();
			});

			it('should contain instance name', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('an instance of Rodent'));
			});

			it('should insert placeholder for anonymous functions', function () {
				sut = instanceOf(function () {});

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('an instance of ANONYMOUS FUNCTION'));
			});

			it('should contain mismatched type', function () {

				sut.describeMismatch('another value', description);

				__.assertThat(description.get(), __.equalTo('"another value" is a String'));
			});

			it('should handle undefined value', function () {
				var undef;

				sut.describeMismatch(undef, description);

				__.assertThat(description.get(), __.equalTo('was undefined'));
			});

			it('should contain mismatched type for custom types', function () {

				sut.describeMismatch(new Animal(), description);

				__.assertThat(description.get(), __.equalTo('{} is a Animal'));
			});
		});
	});
});
