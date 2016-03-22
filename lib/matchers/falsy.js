'use strict';

const _ = require('lodash');
const Matcher = require('./Matcher');

function falsy() {
	return _.create(new Matcher(), {
		matches: function (actualValue) {
			return !actualValue;
		},
		describeTo: function (description) {
			description.append('falsy value');
		}
	});
}

module.exports = falsy;
