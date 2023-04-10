'use strict';

const _create = require('lodash/create');
const Matcher = require('./Matcher');

function IsAnything() {
	return _create(new Matcher(), {
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
