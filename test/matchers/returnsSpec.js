'use strict';

var _ = require('lodash');
var __ = require('../../lib/hamjest');

describe('returns(valueOrMatcher)', function () {

	describe('without an argument', function () {
		it('should match if the given function returns', function () {
			var sut = __.returns();

			__.assertThat(sut, __.matches(_.constant(null)));
		});

		describe('description', function () {
			it('should be concise', function () {
				var sut = __.returns();

				__.assertThat(sut, __.hasDescription('a function returning anything'));
			});
		});
	});

	describe('with a value argument', function () {
		it('should match if the given function\'s return value matches the given value', function () {
			var sut = __.returns('the one true value');

			__.assertThat(sut, __.matches(_.constant('the one true value')));
		});

		it('should not match if return value does not match', function () {
			var sut = __.returns('the one true value');

			__.assertThat(sut, __.failsToMatch(_.constant('unexpected'), 'return value was "unexpected"'));
		});
	});

	describe('with a matcher argument', function () {
		it('should match if the given function\'s return value matches the given matcher', function () {
			var sut = __.returns(__.containsString('true value'));

			__.assertThat(sut, __.matches(_.constant('the one true value')));
		});

		it('should not match if return value does not match', function () {
			var sut = __.returns(__.containsString('Very expected'));

			__.assertThat(sut, __.failsToMatch(_.constant('unexpected'), 'return value was "unexpected"'));
		});
	});

	_.forEach([
		[undefined, 'was undefined'],
		[null, 'was null'],
	], function (args) {
		var fn = args[0];
		var expectedDescription = args[1];
		it('should not match if given value is not a function: ' + fn, function () {
			var sut = __.returns(__.anything());

			__.assertThat(sut, __.failsToMatch(fn, expectedDescription));
		});
	});

	_.forEach([
		[function throwsMessageError() {throw new Error('Bad');}, 'function threw Error: "Bad"'],
		[function throwsError() {throw new Error();}, 'function threw Error']
	], function (args) {
		var fn = args[0];
		var expectedDescription = args[1];
		it('should describe error if given function throws: ' + fn, function () {
			var sut = __.returns(__.anything());

			__.assertThat(sut, __.failsToMatch(fn, expectedDescription));
		});
	});

	describe('description', function () {
		it('should contain return value matcher\'s description', function () {
			var sut = __.returns(__.containsString('Very expected'));

			__.assertThat(sut, __.hasDescription('a function returning a string containing "Very expected"'));
		});
	});
});
