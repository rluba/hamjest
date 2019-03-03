'use strict';

const _ = require('lodash');
const __ = require('../../..');
const Animal = require('../zoo').Animal;

describe('FeatureMatcher', () => {

	describe('without feature function', () => {
		function creatureWithName(valueOrMatcher) {
			return new __.FeatureMatcher(valueOrMatcher, 'creature with name', 'name');
		}

		it('should use feature name as property name', () => {
			const sut = creatureWithName(__.containsString('Joe'));

			__.assertThat(sut.matches(new Animal('Joe the rat')), __.is(true));
			__.assertThat(sut.matches(new Animal('Jim the bat')), __.is(false));
		});

		it('should treat missing properties as undefined', () => {
			const sut = creatureWithName(__.not(__.defined()));

			__.assertThat(sut.matches({}), __.is(true));
			__.assertThat(sut.matches({name: 'a name'}), __.is(false));
		});

		it('should wrap simple value in equalTo matcher', () => {
			const sut = creatureWithName('Joe');

			__.assertThat(sut.matches(new Animal('Joe')), __.is(true));
			__.assertThat(sut.matches(new Animal('Joe, the second')), __.is(false));
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should contain item name and matcher description', () => {
				const sut = creatureWithName(__.containsString('Joe'));

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('creature with name a string containing "Joe"'));
			});

			it('for mismatch should contain item, feature and matcher mismatch description', () => {
				const sut = creatureWithName(__.containsString('Joe'));

				sut.describeMismatch(new Animal('Jim'), description);

				__.assertThat(description.get(), __.equalTo('name was "Jim"\nfor {"name":"Jim"}'));
			});
		});
	});

	describe('with feature function', () => {
		function creatureWithNameLength(valueOrMatcher) {
			return new __.FeatureMatcher(valueOrMatcher, 'creature with name length', 'name length', (actual) => _.size(actual.name));
		}
		let sut;
		beforeEach(() => {
			sut = creatureWithNameLength(__.greaterThan(3));
		});

		it('should pass extracted feature value to matcher', () => {
			__.assertThat(sut.matches(new Animal('Thomas')), __.is(true));
			__.assertThat(sut.matches(new Animal('Tom')), __.is(false));
		});

		it('should wrap simple value in equalTo matcher', () => {
			const sut = creatureWithNameLength(3);

			__.assertThat(sut.matches(new Animal('Joe')), __.is(true));
			__.assertThat(sut.matches(new Animal('Joel')), __.is(false));
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should contain item name and matcher description', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('creature with name length a number greater than <3>'));
			});

			it('for mismatch should contain item, feature and matcher mismatch description', () => {

				sut.describeMismatch(new Animal('Jim'), description);

				__.assertThat(description.get(), __.equalTo('name length was <3>\nfor {"name":"Jim"}'));
			});
		});
	});
});
