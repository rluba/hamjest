'use strict';

const _create = require('lodash/create');
const Matcher = require('./Matcher');

function truthy() {
	return _create(new Matcher(), {
		matches: function (actualValue) {
			return !!actualValue;
		},
		describeTo: function (description) {
			description.append('truthy value');
		}
	});
}

module.exports = truthy;
