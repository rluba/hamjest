'use strict';

const __ = require('../../..');
const deferMatcher = require('../deferMatcher');

describe('IsObjectWithProperties', () => {

	describe('hasProperties', () => {
		function Person(name, children) {
			this.name = name;
			this.children = children;
		}

		let sut;
		beforeEach(() => {
			sut = __.hasProperties({
				name: 'Joe',
				children: __.greaterThan(1)
			});
		});

		it('should match if every property is present and matches', () => {
			__.assertThat(sut.matches(new Person('Joe', 2)), __.is(true));
			__.assertThat(sut.matches(new Person('Joe', 7)), __.is(true));

			__.assertThat(sut.matches(new Person('Joel', 7)), __.is(false));
			__.assertThat(sut.matches(new Person('Joe', 1)), __.is(false));
			__.assertThat(sut.matches({name: 'Joe'}), __.is(false));
			__.assertThat(sut.matches({children: 12}), __.is(false));
		});

		it('should ignore unspecified properties', () => {
			__.assertThat(sut.matches({name: 'Joe', children: 2, age: 27}), __.is(true));
		});

		it('should not match non-objects', () => {
			__.assertThat(sut.matches(12), __.is(false));
			__.assertThat(sut.matches(['Joe', 12]), __.is(false));
			__.assertThat(sut.matches([12, 'Joe']), __.is(false));
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should contain matcher description', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('an object with {name: "Joe", children: a number greater than <1>}'));
			});

			it('should contain mismatched properties', () => {

				sut.describeMismatch(new Person('Jim', 1), description);

				__.assertThat(description.get(), __.equalTo('name was "Jim",\nchildren was <1>'));
			});

			it('should omit matched and extra properties', () => {

				sut.describeMismatch({name: 'Joe', age: 27}, description);

				__.assertThat(description.get(), __.equalTo('children was undefined'));
			});

			it('should fit for non-objects', () => {

				sut.describeMismatch(7, description);

				__.assertThat(description.get(), __.equalTo('was a Number (<7>)'));
			});
		});

		describe('with a promising matcher', () => {
			beforeEach(() => {
				sut = __.hasProperties({
					name: deferMatcher(__.is('Joe')),
					age: __.greaterThan(5)
				});
			});

			it('should return a promise', () => {

				const result = sut.matches({name: 'Jim'});

				__.assertThat(result, __.is(__.promise()));
			});

			it('should resolve to false if a property matcher returns a promise resolving to false', () => {

				const result = sut.matches({name: 'Jim', age: 6});

				return __.promiseThat(result, __.willBe(false));
			});

			it('should resolve to false if a property matcher returns false', () => {

				const result = sut.matches({name: 'Joe', age: 5});

				return __.promiseThat(result, __.willBe(false));
			});

			it('should match if every property is present and matches', () => {

				const result = sut.matches({name: 'Joe', age: 6});

				return __.promiseThat(result, __.willBe(true));
			});

			it('should ignore unspecified properties', () => {

				const result = sut.matches({name: 'Joe', age: 6, height: 120});

				return __.promiseThat(result, __.willBe(true));
			});

			describe('description', () => {
				let description;
				beforeEach(() => {
					description = new __.Description();
				});

				it('should contain matcher description', () => {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('an object with {name: deferred: is "Joe", age: a number greater than <5>}'));
				});

				it('should contain mismatched properties', () => {

					return sut.describeMismatch({name: 'Jim', age: 5}, description).then(() => {
						__.assertThat(description.get(), __.equalTo('name deferred: was "Jim",\nage was <5>'));
					});
				});

				it('should omit matched and extra properties', () => {

					return sut.describeMismatch({name: 'Joe', age: 5, height: 89}, description).then(() => {
						__.assertThat(description.get(), __.equalTo('age was <5>'));
					});
				});
			});
		});

		describe('.verbose()', () => {
			beforeEach(() => {
				sut = sut.verbose();
			});

			it('should match if every property is present and matches', () => {
				__.assertThat(sut.matches(new Person('Joe', 2)), __.is(true));
				__.assertThat(sut.matches(new Person('Joe', 7)), __.is(true));

				__.assertThat(sut.matches(new Person('Joel', 7)), __.is(false));
				__.assertThat(sut.matches(new Person('Joe', 1)), __.is(false));
				__.assertThat(sut.matches({name: 'Joe'}), __.is(false));
				__.assertThat(sut.matches({children: 12}), __.is(false));
			});

			it('should ignore unspecified properties', () => {
				__.assertThat(sut.matches({name: 'Joe', children: 2, age: 27}), __.is(true));
			});

			it('should not match non-objects', () => {
				__.assertThat(sut.matches(12), __.is(false));
				__.assertThat(sut.matches(['Joe', 12]), __.is(false));
				__.assertThat(sut.matches([12, 'Joe']), __.is(false));
			});

			describe('description', () => {
				let description;
				beforeEach(() => {
					description = new __.Description();
				});

				it('should contain matcher description', () => {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('an object with {name: "Joe", children: a number greater than <1>}'));
				});

				it('should contain mismatched properties and full object', () => {

					sut.describeMismatch(new Person('Jim', 1), description);

					__.assertThat(description.get(), __.equalTo('name was "Jim",\nchildren was <1>\nfor {"name":"Jim","children":1}'));
				});

				it('should omit matched and extra properties but append the full object', () => {

					sut.describeMismatch({name: 'Joe', age: 27}, description);

					__.assertThat(description.get(), __.equalTo('children was undefined\nfor {"name":"Joe","age":27}'));
				});

				it('should fit for non-objects', () => {

					sut.describeMismatch(7, description);

					__.assertThat(description.get(), __.equalTo('was a Number (<7>)'));
				});
			});
		});
	});

	describe('hasDeepProperties', () => {
		it('converts every sub-object to a hasDeepProperties matcher', () => {
			function Person(name, partner) {
				this.name = name;
				this.partner = partner;
			}
			const sut = __.hasDeepProperties({
				name: 'Joe',
				partner: {
					name: __.startsWith('Jane'),
					pet: {
						name: 'Garfield',
					}
				}
			});

			__.assertThat(sut.matches(new Person('Joe', {name: 'Janette', pet: {name: 'Garfield'}})), __.is(true));
			__.assertThat(sut.matches(new Person('Joe', {name: 'Janette', pet: {name: 'Garfield', age: 52}})), __.is(true));

			__.assertThat(sut.matches(new Person('Joe', {name: 'Janette', pet: {name: 'John'}})), __.is(false));
			__.assertThat(sut.matches(new Person('Joe', {name: 'Abigail', pet: {name: 'Garfield'}})), __.is(false));
		});

		it('converts every sub-array to a "contains(hasDeepProperties(), …)" matcher', () => {
			function Person(name, children = []) {
				this.name = name;
				this.children = children;
			}
			const sut = __.hasDeepProperties({
				name: 'Joe',
				children: [
					{name: 'Jane'},
					{name: 'Jim'},
				],
			});

			__.assertThat(sut.matches(new Person('Joe', [new Person('Jane'), new Person('Jim')])), __.is(true));

			__.assertThat(sut.matches(new Person('Joe')), __.is(false));
			__.assertThat(sut.matches(new Person('Joe', [new Person('Jane')])), __.is(false));
		});
	});

	describe('hasProperty', () => {
		describe('with a simple property name', () => {
			let sut;
			beforeEach(() => {
				sut = __.hasProperty('name', 'Joe');
			});

			it('should match if property is present and matches', () => {
				__.assertThat(sut.matches({name: 'Joe'}), __.is(true));

				__.assertThat(sut.matches({name: 'Joel'}), __.is(false));
				__.assertThat(sut.matches({children: 12}), __.is(false));
			});

			it('should ignore unspecified properties', () => {
				__.assertThat(sut.matches({name: 'Joe', age: 27}), __.is(true));

				__.assertThat(sut.matches({name: 'Joe2', age: 27}), __.is(false));
			});

			it('should not match non-objects', () => {
				__.assertThat(sut.matches(12), __.is(false));
				__.assertThat(sut.matches(['Joe', 12]), __.is(false));
				__.assertThat(sut.matches([12, 'Joe']), __.is(false));
			});

			describe('without second argument', () => {
				beforeEach(() => {
					sut = __.hasProperty('name');
				});

				it('should match if property is defined', () => {
					__.assertThat(sut.matches({name: null}), __.is(true));

					__.assertThat(sut.matches({name: undefined}), __.is(false));
					__.assertThat(sut.matches({foo: 'bar'}), __.is(false));
					__.assertThat(sut.matches({}), __.is(false));
				});
			});

			describe('with false value', () => {
				let sut;
				beforeEach(() => {
					sut = __.hasProperty('enabled', false);
				});

				it('should match if property is present and matches', () => {
					__.assertThat(sut.matches({enabled: false}), __.is(true));

					__.assertThat(sut.matches({enabled: true}), __.is(false));
					__.assertThat(sut.matches({}), __.is(false));
				});

				it('should ignore unspecified properties', () => {
					__.assertThat(sut.matches({enabled: false, age: 27}), __.is(true));

					__.assertThat(sut.matches({enabled: true, age: 27}), __.is(false));
				});

				it('should not match non-objects', () => {
					__.assertThat(sut.matches(12), __.is(false));
					__.assertThat(sut.matches(['Joe', 12]), __.is(false));
					__.assertThat(sut.matches([12, 'Joe']), __.is(false));
				});
			});

			describe('description', () => {
				let description;
				beforeEach(() => {
					description = new __.Description();
				});

				it('should contain value', () => {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('an object with {name: "Joe"}'));
				});

				it('should contain matcher description', () => {
					sut = __.hasProperty('name', __.endsWith('Joe'));

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('an object with {name: a string ending with "Joe"}'));
				});

				it('should contain mismatched properties', () => {

					sut.describeMismatch({name: 'Jim', other: 'ignored'}, description);

					__.assertThat(description.get(), __.equalTo('name was "Jim"'));
				});

				it('should fit for non-objects', () => {

					sut.describeMismatch(7, description);

					__.assertThat(description.get(), __.equalTo('was a Number (<7>)'));
				});
			});
		});

		describe('with a single property name as array', () => {
			let sut;
			beforeEach(() => {
				sut = __.hasProperty(['name'], 'Joe');
			});

			it('should match if property is present and matches', () => {
				__.assertThat(sut.matches({name: 'Joe'}), __.is(true));

				__.assertThat(sut.matches({name: 'Joel'}), __.is(false));
				__.assertThat(sut.matches({children: 12}), __.is(false));
			});

			it('should ignore unspecified properties', () => {
				__.assertThat(sut.matches({name: 'Joe', age: 27}), __.is(true));

				__.assertThat(sut.matches({name: 'Joe2', age: 27}), __.is(false));
			});
		});

		describe('with a dot-path property name', () => {
			let sut;
			beforeEach(() => {
				sut = __.hasProperty('user.name', 'Joe');
			});

			it('should match if property is present and matches', () => {
				__.assertThat(sut.matches({user: {name: 'Joe'}}), __.is(true));

				__.assertThat(sut.matches({user: {name: 'Joe2'}}), __.is(false));
				__.assertThat(sut.matches({name: 'Joe'}), __.is(false));
			});

			it('should ignore unspecified properties', () => {
				__.assertThat(sut.matches({user: {name: 'Joe', age: 27}}), __.is(true));

				__.assertThat(sut.matches({user: {name: 'Joe2', age: 27}}), __.is(false));
			});
		});

		describe('with an array-path property name', () => {
			let sut;
			beforeEach(() => {
				sut = __.hasProperty(['user', 'name'], 'Joe');
			});

			it('should match if property is present and matches', () => {
				__.assertThat(sut.matches({user: {name: 'Joe'}}), __.is(true));

				__.assertThat(sut.matches({user: {name: 'Joe2'}}), __.is(false));
				__.assertThat(sut.matches({name: 'Joe'}), __.is(false));
			});

			it('should ignore unspecified properties', () => {
				__.assertThat(sut.matches({user: {name: 'Joe', age: 27}}), __.is(true));

				__.assertThat(sut.matches({user: {name: 'Joe2', age: 27}}), __.is(false));
			});
		});
	});
});
