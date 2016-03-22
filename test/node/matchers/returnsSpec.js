'use strict';

const _ = require('lodash');
const __ = require('../../..');

describe('returns(valueOrMatcher)', () => {

	describe('without an argument', () => {
		it('should match if the given function returns', () => {
			const sut = __.returns();

			__.assertThat(sut, __.matches(_.constant(null)));
		});

		describe('description', () => {
			it('should be concise', () => {
				const sut = __.returns();

				__.assertThat(sut, __.hasDescription('a function returning anything'));
			});
		});
	});

	describe('with a value argument', () => {
		it('should match if the given function\'s return value matches the given value', () => {
			const sut = __.returns('the one true value');

			__.assertThat(sut, __.matches(_.constant('the one true value')));
		});

		it('should not match if return value does not match', () => {
			const sut = __.returns('the one true value');

			__.assertThat(sut, __.failsToMatch(_.constant('unexpected'), 'return value was "unexpected"'));
		});
	});

	describe('with a matcher argument', () => {
		it('should match if the given function\'s return value matches the given matcher', () => {
			const sut = __.returns(__.containsString('true value'));

			__.assertThat(sut, __.matches(_.constant('the one true value')));
		});

		it('should not match if return value does not match', () => {
			const sut = __.returns(__.containsString('Very expected'));

			__.assertThat(sut, __.failsToMatch(_.constant('unexpected'), 'return value was "unexpected"'));
		});
	});

	_.forEach([
		[undefined, 'was undefined'],
		[null, 'was null'],
	], (args) => {
		const fn = args[0];
		const expectedDescription = args[1];
		it('should not match if given value is not a function: ' + fn, () => {
			const sut = __.returns(__.anything());

			__.assertThat(sut, __.failsToMatch(fn, expectedDescription));
		});
	});

	_.forEach([
		[function throwsMessageError() {throw new Error('Bad');}, 'function threw Error: "Bad"'],
		[function throwsError() {throw new Error();}, 'function threw Error']
	], (args) => {
		const fn = args[0];
		const expectedDescription = args[1];
		it('should describe error if given function throws: ' + fn, () => {
			const sut = __.returns(__.anything());

			__.assertThat(sut, __.failsToMatch(fn, expectedDescription));
		});
	});

	describe('description', () => {
		it('should contain return value matcher\'s description', () => {
			const sut = __.returns(__.containsString('Very expected'));

			__.assertThat(sut, __.hasDescription('a function returning a string containing "Very expected"'));
		});
	});
});
