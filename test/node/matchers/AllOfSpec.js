'use strict';

const q = require('q');
const __ = require('../../../lib/hamjest');
const assertTrue = require('../asserts').assertTrue;
const assertFalse = require('../asserts').assertFalse;
const deferMatcher = require('../deferMatcher');

describe('AllOf', () => {

	describe('allOf', () => {
		let sut;
		beforeEach(() => {
			sut = __.allOf(__.containsString('expected'), __.containsString('value'));
		});

		it('should match if every matcher matches', () => {
			assertTrue(sut.matches('expected value'));
			assertTrue(sut.matches('value expected'));
		});

		it('should not match if one matcher does not match', () => {
			assertFalse(sut.matches('expected valu'));
			assertFalse(sut.matches('expecte value'));
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should contain each matcher', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('(a string containing "expected" and a string containing "value")'));
			});

			it('should contain mismatch description of all mismatching matchers', () => {
				const actual = 'another val';

				sut.describeMismatch(actual, description);

				__.assertThat(description.get(), __.equalTo('a string containing "expected": was "another val"\na string containing "value": was "another val"'));
			});
		});

		describe('with a promising matcher', () => {
			beforeEach(() => {
				sut = __.allOf(__.containsString('expected'), deferMatcher(__.containsString('value')));
			});

			it('should return a promise if any of the matchers returns a promise', () => {

				assertTrue(q.isPromise(sut.matches('expected value')));
			});

			it('should resolve to false if a matcher returns a promise resolving to false', () => {

				return sut.matches('expected valu').then((value) => {
					assertFalse(value);
				});
			});

			it('should resolve to false if a matcher returns false', () => {

				return sut.matches('other value').then((value) => {
					assertFalse(value);
				});
			});

			it('should resolve to true if all matchers resolve to true', () => {

				return sut.matches('expected value').then((value) => {
					assertTrue(value);
				});
			});

			describe('description', () => {
				let description;
				beforeEach(() => {
					description = new __.Description();
				});

				it('should return promise if one of the matchers returns a promise', () => {
					const sut = __.allOf(__.containsString('expected'), deferMatcher(__.containsString('value')));
					const actual = 'another valu';

					return sut.describeMismatch(actual, description).then(() => {
						__.assertThat(description.get(), __.equalTo('a string containing "expected": was "another valu"\ndeferred: a string containing "value": deferred: was "another valu"'));
					});
				});
			});
		});
	});
});
