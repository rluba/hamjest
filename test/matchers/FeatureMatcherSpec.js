'use strict';

var _ = require('lodash')
	, FeatureMatcher = require('../../lib/matchers/FeatureMatcher')
	, Description = require('../../lib/Description')
	, __ = require('../../lib/hamjest')
	, Animal = require('../zoo').Animal
	;

describe('FeatureMatcher', function () {

	describe('without feature function', function () {
		function creatureWithName(matcherOrValue) {
			return new FeatureMatcher(matcherOrValue, 'creature with name', 'name');
		}

		it('should use feature name as property name', function () {
			var sut = creatureWithName(__.containsString('Joe'));

			__.assertThat(sut.matches(new Animal('Joe the rat')), __.is(true));
			__.assertThat(sut.matches(new Animal('Jim the bat')), __.is(false));
		});

		it('should treat missing properties as undefined', function () {
			var sut = creatureWithName(__.not(__.defined()));

			__.assertThat(sut.matches({}), __.is(true));
			__.assertThat(sut.matches({name: 'a name'}), __.is(false));
		});

		it('should wrap simple value in equalTo matcher', function () {
			var sut = creatureWithName('Joe');

			__.assertThat(sut.matches(new Animal('Joe')), __.is(true));
			__.assertThat(sut.matches(new Animal('Joe, the second')), __.is(false));
		});

		describe('description', function () {
			var description;

			beforeEach(function () {
				description = new Description();
			});

			it('should contain item name and matcher description', function () {
				var sut = creatureWithName(__.containsString('Joe'));

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('creature with name a string containing "Joe"'));
			});

			it('for mismatch should contain item, feature and matcher mismatch description', function () {
				var sut = creatureWithName(__.containsString('Joe'));

				sut.describeMismatch(new Animal('Jim'), description);

				__.assertThat(description.get(), __.equalTo('name was "Jim"\nfor {"name":"Jim"}'));
			});
		});
	});

	describe('with feature function', function () {
		function creatureWithNameLength(matcherOrValue) {
			return new FeatureMatcher(matcherOrValue, 'creature with name length', 'name length', function (actual) {
				return _.size(actual.name);
			});
		}
		var sut;
		beforeEach(function () {
			sut = creatureWithNameLength(__.greaterThan(3));
		});

		it('should pass extracted feature value to matcher', function () {
			__.assertThat(sut.matches(new Animal('Thomas')), __.is(true));
			__.assertThat(sut.matches(new Animal('Tom')), __.is(false));
		});

		it('should wrap simple value in equalTo matcher', function () {
			var sut = creatureWithNameLength(3);

			__.assertThat(sut.matches(new Animal('Joe')), __.is(true));
			__.assertThat(sut.matches(new Animal('Joel')), __.is(false));
		});

		describe('description', function () {
			var description;

			beforeEach(function () {
				description = new Description();
			});

			it('should contain item name and matcher description', function () {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('creature with name length a number greater than <3>'));
			});

			it('for mismatch should contain item, feature and matcher mismatch description', function () {

				sut.describeMismatch(new Animal('Jim'), description);

				__.assertThat(description.get(), __.equalTo('name length was <3>\nfor {"name":"Jim"}'));
			});
		});
	});
});
