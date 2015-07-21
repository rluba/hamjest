'use strict';

var _ = require('lodash')
	, hamjest = require('../lib/hamjest')
	, assertFalse = require('./asserts').assertFalse
	;

describe('hamjest', function () {
	it('should not export undefined matchers', function () {
		_.forEach(hamjest, function (value, key) {
			assertFalse(_.isUndefined(value), 'Undefined entry for key: ' + key);
		});
	});

	it('should export Description', function () {
		var __ = hamjest;

		__.assertThat(hamjest, __.hasProperty('Description'));
	});

	describe('.describe()', function() {
		it('should allow to fetch the description of a given matcher', function () {
			var __ = hamjest;

			var result = __.describe(__.hasSize(5));

			__.assertThat(result, __.is('a collection or string with size <5>'));
		});
	});
});
