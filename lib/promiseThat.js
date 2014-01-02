'use strict';

var q = require('q')
	, assertThat = require('./assertThat')
	;

function promiseThat(reason, promiseOrValue, promiseMatcher) {
	if (arguments.length === 2) {
		promiseMatcher = promiseOrValue;
		promiseOrValue = reason;
		reason = '';
	}

	var promise = q(promiseOrValue);
	return promise.then(function (value) {
		assertThat(reason, value, promiseMatcher);
	});
}

module.exports = promiseThat;

