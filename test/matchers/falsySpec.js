'use strict';

var _ = require('lodash');
var __ = require('../../lib/hamjest');

describe('falsy', function () {
	var sut;
	beforeEach(function () {
		sut = __.falsy();
	});

	_.forEach([
		[true, 'was true'],
		['a string', 'was "a string"'],
		[5, 'was <5>'],
		[[], 'was []'],
		[{}, 'was {}']
	], function (option) {
		var value = option[0];
		var expectedDescription = option[1];
		it('should not match truthy values: ' + value, function () {
			__.assertThat(sut, __.failsToMatch(value, expectedDescription));
		});
	});

	_.forEach([
		false,
		null,
		undefined,
		''
	], function (value) {
		it('should match falsy values: ' + value, function () {
			__.assertThat(sut, __.matches(value));
		});
	});

	describe('description', function () {
		it('should be concise', function () {

			__.assertThat(sut, __.hasDescription('falsy value'));
		});
	});
});
