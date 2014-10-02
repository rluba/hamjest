'use strict';

var q = require('q');
var willHaveProperties = require('../../lib/matchers/willHaveProperties')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	;

describe('willHaveProperties', function () {
	it('should return a promise', function () {
		var sut = willHaveProperties({});

		var result = sut.matches({name: 'Jim'});

		__.assertThat(result, __.is(__.promise()));
	});

	it('should resolve to false if a property matcher returns a promise resolving to false', function () {
		var sut = willHaveProperties({
			name: __.willBe('Joe')
		});

		var result = sut.matches({name: 'Jim'});

		return __.promiseThat(result, __.willBe(false));
	});

	it('should resolve to false if a property does not match', function () {
		var sut = willHaveProperties({
			name: 'Joe'
		});

		var result = sut.matches({name: 'Jim'});

		return __.promiseThat(result, __.willBe(false));
	});

	it('should resolve to false if a property matcher returns false', function () {
		var sut = willHaveProperties({
			name: __.containsString('Joe')
		});

		var result = sut.matches({name: 'Jim'});

		return __.promiseThat(result, __.willBe(false));
	});

	it('should resolve to false if promise is fulfilled with an object that does not match', function () {
		var sut = willHaveProperties({
			name: __.willBe('Joe')
		});

		var result = sut.matches(q({name: 'Jim'}));

		return __.promiseThat(result, __.willBe(false));
	});

	it('should match if every property is present and matches', function () {
		var sut = willHaveProperties({
			name: __.containsString('Joe'),
			age: __.willBe(5),
			title: 'Grand Master'
		});

		var result = sut.matches({name: 'Joel', age: q(5), title: 'Grand Master'});

		return __.promiseThat(result, __.willBe(true));
	});

	it('should match if promise is resolved with an object where every property is present and matches', function () {
		var sut = willHaveProperties({
			name: __.containsString('Joe'),
			age: __.willBe(5),
			title: 'Grand Master'
		});

		var result = sut.matches(q({name: 'Joel', age: q(5), title: 'Grand Master'}));

		return __.promiseThat(result, __.willBe(true));
	});

	it('should ignore unspecified properties', function () {
		var sut = willHaveProperties({
			name: __.willBe('Joe')
		});

		var result = sut.matches({name: q('Joe'), age: 5});

		return __.promiseThat(result, __.willBe(true));
	});

	it('should not match non-objects', function () {
		var sut = willHaveProperties({
			name: __.willBe('Joe')
		});

		return q.all([
			__.promiseThat(sut.matches(12), __.willBe(false)),
			__.promiseThat(sut.matches(['Joe', 12]), __.willBe(false)),
			__.promiseThat(sut.matches([12, 'Joe']), __.willBe(false))
		]);
	});

	describe('description', function () {
		var description;
		var sut;
		beforeEach(function () {
			description = new Description();
			sut = willHaveProperties({
				name: 'Joe',
				age: __.willBe(5),
				height: __.greaterThan(90)
			});
		});

		it('should contain matcher description', function () {

			sut.describeTo(description);

			__.assertThat(description.get(), __.equalTo('an object with {name: "Joe", age: a promise fulfilled with <5>, height: a number greater than <90>}'));
		});

		it('should contain mismatched properties', function () {

			return sut.describeMismatch({name: 'Jim', age: q(4), height: 89}, description).then(function () {
				__.assertThat(description.get(), __.equalTo('name was "Jim", age was fulfilled with <4>, height was <89>'));
			});
		});

		it('should omit matched and extra properties', function () {

			return sut.describeMismatch({name: 'Joe', age: q(5)}, description).then(function () {
				__.assertThat(description.get(), __.equalTo('height was undefined'));
			});
		});

		it('should fit for non-objects', function () {

			return sut.describeMismatch(7, description).then(function () {
				__.assertThat(description.get(), __.equalTo('was a number (<7>)'));
			});
		});
	});
});

describe('willHaveProperty', function () {
	var willHaveProperty = willHaveProperties.willHaveProperty;

	it('should match if property is present and matches', function () {
		var sut = willHaveProperty('name', 'Joe');

		return q.all([
			__.promiseThat(sut.matches({name: 'Joe'}), __.willBe(true)),
			__.promiseThat(sut.matches(q({name: 'Joe'})), __.willBe(true)),

			__.promiseThat(sut.matches({name: 'Joel'}), __.willBe(false)),
			__.promiseThat(sut.matches({children: 12}), __.willBe(false)),
			__.promiseThat(sut.matches(q({name: 'Joel'})), __.willBe(false))
		]);
	});

	describe('with inner promise matcher', function () {
		var sut;
		beforeEach(function () {
			sut = willHaveProperty('name', __.willBe('Joe'));
		});

		it('should match if property is present and matcher resolves to true', function () {
			return __.promiseThat(sut.matches({name: q('Joe')}), __.willBe(true));
		});

		it('should match if promise is resolved with object where property is present and matcher resolves to true', function () {
			return __.promiseThat(sut.matches(q({name: q('Joe')})), __.willBe(true));
		});

		it('should not match if promise is resolved with object where property is present but matcher resolves to false', function () {
			return __.promiseThat(sut.matches(q({name: 'Joel'})), __.willBe(false));
		});

		it('should not match if property is present but matcher resolves to false #1', function () {
			return __.promiseThat(sut.matches({name: q('Joel')}), __.willBe(false));
		});

		it('should not match if property is present but matcher resolves to false #2', function () {
			return __.promiseThat(sut.matches({name: 'Joe'}), __.willBe(false));
		});

		it('should not match if property is not present', function () {
			return __.promiseThat(sut.matches({children: 12}), __.willBe(false));
		});
	});

	it('should ignore unspecified properties', function () {
		var sut = willHaveProperty('name', 'Joe');

		return q.all([
			__.promiseThat(sut.matches({name: 'Joe', age: 27}), __.willBe(true)),
			__.promiseThat(sut.matches(q({name: 'Joe', age: 27})), __.willBe(true)),

			__.promiseThat(sut.matches({name: 'Joe2', age: 27}), __.willBe(false)),
			__.promiseThat(sut.matches(q({name: 'Joe2', age: 27})), __.willBe(false))
		]);
	});

	it('should not match non-objects', function () {
		var sut = willHaveProperty('name', 'Joe');

		return q.all([
			__.promiseThat(sut.matches(12), __.willBe(false)),
			__.promiseThat(sut.matches(['Joe', 12]), __.willBe(false)),
			__.promiseThat(sut.matches([12, 'Joe']), __.willBe(false)),
			__.promiseThat(sut.matches(q(12)), __.willBe(false))
		]);
	});

	describe('without second argument', function () {
		var sut;
		beforeEach(function () {
			sut = willHaveProperty('name');
		});

		it('should match if property is defined', function () {
			return q.all([
				__.promiseThat(sut.matches({name: null}), __.willBe(true)),
				__.promiseThat(sut.matches(q({name: null})), __.willBe(true)),

				__.promiseThat(sut.matches({name: undefined}), __.willBe(false)),
				__.promiseThat(sut.matches(q({name: undefined})), __.willBe(false)),
				__.promiseThat(sut.matches({foo: 'bar'}), __.willBe(false)),
				__.promiseThat(sut.matches({}), __.willBe(false))
			]);
		});
	});

	describe('with false value', function () {
		var sut;
		beforeEach(function () {
			sut = willHaveProperty('enabled', false);
		});

		it('should match if property is present and matches', function () {
			return q.all([
				__.promiseThat(sut.matches({enabled: false}), __.willBe(true)),
				__.promiseThat(sut.matches(q({enabled: false})), __.willBe(true)),

				__.promiseThat(sut.matches(q({enabled: true})), __.willBe(false)),
				__.promiseThat(sut.matches({}), __.willBe(false))
			]);
		});

		it('should ignore unspecified properties', function () {
			return q.all([
				__.promiseThat(sut.matches({enabled: false, age: 27}), __.willBe(true)),

				__.promiseThat(sut.matches({enabled: true, age: 27}), __.willBe(false))
			]);
		});

		it('should not match non-objects', function () {
			return q.all([
				__.promiseThat(sut.matches(12), __.willBe(false)),
				__.promiseThat(sut.matches(['Joe', 12]), __.willBe(false)),
				__.promiseThat(sut.matches([12, 'Joe']), __.willBe(false))
			]);
		});
	});

	describe('description', function () {
		var description;

		beforeEach(function () {
			description = new Description();
		});

		it('should contain value', function () {
			var sut = willHaveProperty('name', 'Joe');

			sut.describeTo(description);

			__.assertThat(description.get(), __.equalTo('an object with {name: "Joe"}'));
		});

		it('should contain matcher descirption', function () {
			var sut = willHaveProperty('name', __.willBe('Joe'));

			sut.describeTo(description);

			__.assertThat(description.get(), __.equalTo('an object with {name: a promise fulfilled with "Joe"}'));
		});

		it('should contain mismatched properties', function () {
			var sut = willHaveProperty('name', 'Joe');

			return sut.describeMismatch({name: 'Jim', other: 'ignored'}, description).then(function () {
				__.assertThat(description.get(), __.equalTo('name was "Jim"'));
			});
		});

		it('should fit for non-objects', function () {
			var sut = willHaveProperty('name', 'Joe');

			sut.describeMismatch(7, description).then(function () {
				__.assertThat(description.get(), __.equalTo('was a number (<7>)'));
			});
		});
	});
});
