'use strict';

const _ = require('lodash');
const assert = require('assert');

const __ = require('../../../lib/hamjest');
const deferMatcher = require('../deferMatcher');

describe('AllOf', () => {

	describe('allOf', () => {
		let sut;
		beforeEach(() => {
			sut = __.allOf(__.containsString('expected'), __.containsString('value'));
		});

		it('should match if every matcher matches', () => {
			assert.ok(sut.matches('expected value'));
			assert.ok(sut.matches('value expected'));
		});

		it('should not match if one matcher does not match', () => {
			assert.equal(sut.matches('expected valu'), false);
			assert.equal(sut.matches('expecte value'), false);
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

				const result = sut.matches('expected value');

				assert.ok(result);
				assert.ok(_.isFunction(result.then));
			});

			it('should resolve to false if a matcher returns a promise resolving to false', () => {

				return sut.matches('expected valu').then((value) => {
					assert.equal(value, false);
				});
			});

			it('should resolve to false if a matcher returns false', () => {

				return sut.matches('other value').then((value) => {
					assert.equal(value, false);
				});
			});

			it('should resolve to true if all matchers resolve to true', () => {

				return sut.matches('expected value').then((value) => {
					assert.ok(value);
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
