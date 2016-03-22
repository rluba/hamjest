'use strict';

const _ = require('lodash');
const Matcher = require('./Matcher');

function IsAnything() {
	return _.create(new Matcher(), {
		matches: function () {
			return true;
		},
		describeTo: function (description) {
			description.append('anything');
		}
	});
}

IsAnything.anything = function () {
	return new IsAnything();
};

module.exports = IsAnything;
