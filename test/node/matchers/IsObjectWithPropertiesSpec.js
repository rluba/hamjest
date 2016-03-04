'use strict';

var __ = require('../../..');
var deferMatcher = require('../deferMatcher');

describe('IsObjectWithProperties', function () {

	describe('hasProperties', function () {
		function Person(name, children) {
			this.name = name;
			this.children = children;
		}

		var sut;
		beforeEach(function () {
			sut = __.hasProperties({
				name: 'Joe',
				children: __.greaterThan(1)
			});
		});

		it('should match if every property is present and matches', function () {
			__.assertThat(sut.matches(new Person('Joe', 2)), __.is(true));
			__.assertThat(sut.matches(new Person('Joe', 7)), __.is(true));

			__.assertThat(sut.matches(new Person('Joel', 7)), __.is(false));
			__.assertThat(sut.matches(new Person('Joe', 1)), __.is(false));
			__.assertThat(sut.matches({name: 'Joe'}), __.is(false));
			__.assertThat(sut.matches({children: 12}), __.is(false));
		});

		it('should ignore unspecified properties', function () {
			__.assertThat(sut.matches({name: 'Joe', children: 2, age: 27}), __.is(true));
		});

		it('should not match non-objects', function () {
			__.assertThat(sut.matches(12), __.is(false));
			__.assertThat(sut.matches(['Joe', 12]), __.is(false));
			__.assertThat(sut.matches([12, 'Joe']), __.is(false));
		});

		describe('description', function () {
			var description;
			beforeEach(function () {
				description = new __.Description();
			});

			it('should contain matcher description', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('an object with {name: "Joe", children: a number greater than <1>}'));
			});

			it('should contain mismatched properties', function () {

				sut.describeMismatch(new Person('Jim', 1), description);

				__.assertThat(description.get(), __.equalTo('name was "Jim", children was <1>'));
			});

			it('should omit matched and extra properties', function () {

				sut.describeMismatch({name: 'Joe', age: 27}, description);

				__.assertThat(description.get(), __.equalTo('children was undefined'));
			});

			it('should fit for non-objects', function () {

				sut.describeMismatch(7, description);

				__.assertThat(description.get(), __.equalTo('was a Number (<7>)'));
			});
		});

		describe('with a promising matcher', function () {
			beforeEach(function () {
				sut = __.hasProperties({
					name: deferMatcher(__.is('Joe')),
					age: __.greaterThan(5)
				});
			});

			it('should return a promise', function () {

				var result = sut.matches({name: 'Jim'});

				__.assertThat(result, __.is(__.promise()));
			});

			it('should resolve to false if a property matcher returns a promise resolving to false', function () {

				var result = sut.matches({name: 'Jim', age: 6});

				return __.promiseThat(result, __.willBe(false));
			});

			it('should resolve to false if a property matcher returns false', function () {

				var result = sut.matches({name: 'Joe', age: 5});

				return __.promiseThat(result, __.willBe(false));
			});

			it('should match if every property is present and matches', function () {

				var result = sut.matches({name: 'Joe', age: 6});

				return __.promiseThat(result, __.willBe(true));
			});

			it('should ignore unspecified properties', function () {

				var result = sut.matches({name: 'Joe', age: 6, height: 120});

				return __.promiseThat(result, __.willBe(true));
			});

			describe('description', function () {
				var description;
				beforeEach(function () {
					description = new __.Description();
				});

				it('should contain matcher description', function () {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('an object with {name: deferred: is "Joe", age: a number greater than <5>}'));
				});

				it('should contain mismatched properties', function () {

					return sut.describeMismatch({name: 'Jim', age: 5}, description).then(function () {
						__.assertThat(description.get(), __.equalTo('name deferred: was "Jim", age was <5>'));
					});
				});

				it('should omit matched and extra properties', function () {

					return sut.describeMismatch({name: 'Joe', age: 5, height: 89}, description).then(function () {
						__.assertThat(description.get(), __.equalTo('age was <5>'));
					});
				});
			});
		});

		describe('.verbose()', function () {
			beforeEach(function () {
				sut = sut.verbose();
			});

			it('should match if every property is present and matches', function () {
				__.assertThat(sut.matches(new Person('Joe', 2)), __.is(true));
				__.assertThat(sut.matches(new Person('Joe', 7)), __.is(true));

				__.assertThat(sut.matches(new Person('Joel', 7)), __.is(false));
				__.assertThat(sut.matches(new Person('Joe', 1)), __.is(false));
				__.assertThat(sut.matches({name: 'Joe'}), __.is(false));
				__.assertThat(sut.matches({children: 12}), __.is(false));
			});

			it('should ignore unspecified properties', function () {
				__.assertThat(sut.matches({name: 'Joe', children: 2, age: 27}), __.is(true));
			});

			it('should not match non-objects', function () {
				__.assertThat(sut.matches(12), __.is(false));
				__.assertThat(sut.matches(['Joe', 12]), __.is(false));
				__.assertThat(sut.matches([12, 'Joe']), __.is(false));
			});

			describe('description', function () {
				var description;
				beforeEach(function () {
					description = new __.Description();
				});

				it('should contain matcher description', function () {

					sut.describeTo(description);

					__.assertThat(description.get(), __.equalTo('an object with {name: "Joe", children: a number greater than <1>}'));
				});

				it('should contain mismatched properties and full object', function () {

					sut.describeMismatch(new Person('Jim', 1), description);

					__.assertThat(description.get(), __.equalTo('name was "Jim", children was <1>\n\tfor {"name":"Jim","children":1}'));
				});

				it('should omit matched and extra properties but append the full object', function () {

					sut.describeMismatch({name: 'Joe', age: 27}, description);

					__.assertThat(description.get(), __.equalTo('children was undefined\n\tfor {"name":"Joe","age":27}'));
				});

				it('should fit for non-objects', function () {

					sut.describeMismatch(7, description);

					__.assertThat(description.get(), __.equalTo('was a Number (<7>)'));
				});
			});
		});
	});

	describe('hasProperty', function () {
		var sut;
		beforeEach(function () {
			sut = __.hasProperty('name', 'Joe');
		});

		it('should match if property is present and matches', function () {
			__.assertThat(sut.matches({name: 'Joe'}), __.is(true));

			__.assertThat(sut.matches({name: 'Joel'}), __.is(false));
			__.assertThat(sut.matches({children: 12}), __.is(false));
		});

		it('should ignore unspecified properties', function () {
			__.assertThat(sut.matches({name: 'Joe', age: 27}), __.is(true));

			__.assertThat(sut.matches({name: 'Joe2', age: 27}), __.is(false));
		});

		it('should not match non-objects', function () {
			__.assertThat(sut.matches(12), __.is(false));
			__.assertThat(sut.matches(['Joe', 12]), __.is(false));
			__.assertThat(sut.matches([12, 'Joe']), __.is(false));
		});

		describe('without second argument', function () {
			beforeEach(function () {
				sut = __.hasProperty('name');
			});

			it('should match if property is defined', function () {
				__.assertThat(sut.matches({name: null}), __.is(true));

				__.assertThat(sut.matches({name: undefined}), __.is(false));
				__.assertThat(sut.matches({foo: 'bar'}), __.is(false));
				__.assertThat(sut.matches({}), __.is(false));
			});
		});

		describe('with false value', function () {
			var sut;
			beforeEach(function () {
				sut = __.hasProperty('enabled', false);
			});

			it('should match if property is present and matches', function () {
				__.assertThat(sut.matches({enabled: false}), __.is(true));

				__.assertThat(sut.matches({enabled: true}), __.is(false));
				__.assertThat(sut.matches({}), __.is(false));
			});

			it('should ignore unspecified properties', function () {
				__.assertThat(sut.matches({enabled: false, age: 27}), __.is(true));

				__.assertThat(sut.matches({enabled: true, age: 27}), __.is(false));
			});

			it('should not match non-objects', function () {
				__.assertThat(sut.matches(12), __.is(false));
				__.assertThat(sut.matches(['Joe', 12]), __.is(false));
				__.assertThat(sut.matches([12, 'Joe']), __.is(false));
			});
		});

		describe('description', function () {
			var description;
			beforeEach(function () {
				description = new __.Description();
			});

			it('should contain value', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('an object with {name: "Joe"}'));
			});

			it('should contain matcher description', function () {
				sut = __.hasProperty('name', __.endsWith('Joe'));

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('an object with {name: a string ending with "Joe"}'));
			});

			it('should contain mismatched properties', function () {

				sut.describeMismatch({name: 'Jim', other: 'ignored'}, description);

				__.assertThat(description.get(), __.equalTo('name was "Jim"'));
			});

			it('should fit for non-objects', function () {

				sut.describeMismatch(7, description);

				__.assertThat(description.get(), __.equalTo('was a Number (<7>)'));
			});
		});
	});
});
