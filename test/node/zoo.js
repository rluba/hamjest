'use strict';

const _ = require('lodash');
const assert = require('assert');

// Simple object hierarchy for testing
function Animal(name) {
	this.name = name;
}

function Rodent(name) {
	Animal.call(this, name);
}
Rodent.prototype = _.create(Animal.prototype, {constructor: Rodent});

function Squirrel(name) {
	Rodent.call(this, name);
}
Squirrel.prototype = _.create(Rodent.prototype, {constructor: Squirrel});

assert.ok(new Animal() instanceof Animal);
assert.ok(new Rodent() instanceof Animal);
assert.ok(new Squirrel() instanceof Animal);

assert.equal(new Animal() instanceof Rodent, false);
assert.ok(new Rodent() instanceof Rodent);
assert.ok(new Squirrel() instanceof Rodent);

assert.equal(new Animal() instanceof Rodent, false);
assert.equal(new Rodent() instanceof Squirrel, false);
assert.ok(new Squirrel() instanceof Squirrel);

module.exports = {
	Animal: Animal,
	Rodent: Rodent,
	Squirrel: Squirrel
};
