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
	return promise.then(function () {
		return assertThat(reason, promise, promiseMatcher);
	}, function () {
		return assertThat(reason, promise, promiseMatcher);
	});
}

module.exports = promiseThat;

