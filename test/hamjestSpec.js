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
});
