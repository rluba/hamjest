'use strict';

var IsObjectWithProperties = require('../../lib/matchers/IsObjectWithProperties')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	;

describe('IsObjectWithProperties', function () {

	describe('hasProperties', function () {
		var hasProperties = IsObjectWithProperties.hasProperties;

		function Person(name, children) {
			this.name = name,
			this.children = children;
		}

		var sut;
		beforeEach(function () {
			sut = hasProperties({
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
				description = new Description();
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

				__.assertThat(description.get(), __.equalTo('was a number (<7>)'));
			});
		});
	});
});
