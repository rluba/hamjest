'use strict';

var _ = require('lodash-node')
	, AssertionError = require('assertion-error')
	, IsInstanceOf = require('../../lib/matchers/IsInstanceOf')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, assertTrue = require('../asserts').assertTrue
	, assertFalse = require('../asserts').assertFalse
	;

// Simple Hierarchy for testing
function Animal() {
}

function Rodent() {
	Animal.call(this);
}
Rodent.prototype = _.create(Animal.prototype, { 'constructor': Rodent });

function Squirrel() {
	Rodent.call(this);
}
Squirrel.prototype = _.create(Rodent.prototype, { 'constructor': Squirrel });

assertTrue(new Animal() instanceof Animal);
assertTrue(new Rodent() instanceof Animal);
assertTrue(new Squirrel() instanceof Animal);

assertFalse(new Animal() instanceof Rodent);
assertTrue(new Rodent() instanceof Rodent);
assertTrue(new Squirrel() instanceof Rodent);

assertFalse(new Animal() instanceof Rodent);
assertFalse(new Rodent() instanceof Squirrel);
assertTrue(new Squirrel() instanceof Squirrel);

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
			}, __.throws(AssertionError));
		});

		it('should match instances and subinstances', function () {
			assertFalse(sut.matches(new Animal()));
			assertTrue(sut.matches(new Rodent()));
			assertTrue(sut.matches(new Squirrel()));
		});

		describe('description', function () {
			var description;

			beforeEach(function () {
				description = new Description();
			});

			it('should contain instance name', function () {
				var description = new Description();

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('an instance of Rodent'));
			});

			it('should insert placeholder for anonymous functions', function () {
				var description = new Description();
				sut = instanceOf(function () {});

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('an instance of ANONYMOUS FUNCTION'));
			});

			it('should contain mismatched type', function () {
				var description = new Description();

				sut.describeMismatch('another value', description);

				__.assertThat(description.get(), __.equalTo('"another value" is a String'));
			});

			it('should contain mismatched type for custom types', function () {
				var description = new Description();

				sut.describeMismatch(new Animal(), description);

				__.assertThat(description.get(), __.equalTo('{} is a Animal'));
			});
		});
	});
});
