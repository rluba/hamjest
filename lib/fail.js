'use strict';

const AssertionError = require('assertion-error');

function fail(reason) {
	throw new AssertionError(reason, {}, fail);
}

module.exports = fail;
