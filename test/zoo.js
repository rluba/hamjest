'use strict';

var _ = require('lodash')
	, assertTrue = require('./asserts').assertTrue
	, assertFalse = require('./asserts').assertFalse
	;

// Simple object hierarchy for testing
function Animal(name) {
	this.name = name;
}

function Rodent(name) {
	Animal.call(this, name);
}
Rodent.prototype = _.create(Animal.prototype, { 'constructor': Rodent });

function Squirrel(name) {
	Rodent.call(this, name);
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

module.exports = {
	Animal: Animal,
	Rodent: Rodent,
	Squirrel: Squirrel
};
