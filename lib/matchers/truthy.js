'use strict';

var _ = require('lodash')
	, Matcher = require('./Matcher')
	;

function truthy() {
	return _.create(new Matcher(), {
		matches: function (actualValue) {
			return !!actualValue;
		},
		describeTo: function (description) {
			description.append('truthy value');
		}
	});
}

module.exports = truthy;
