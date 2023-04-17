'use strict';

const _create = require('lodash/create');
const Matcher = require('./Matcher');

function falsy() {
	return _create(new Matcher(), {
		matches: function (actualValue) {
			return !actualValue;
		},
		describeTo: function (description) {
			description.append('falsy value');
		}
	});
}

module.exports = falsy;
