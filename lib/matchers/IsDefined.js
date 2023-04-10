'use strict';

const _create = require('lodash/create');
const _isUndefined = require('lodash/isUndefined');
const Matcher = require('./Matcher');
const not = require('./IsNot').not;

function IsDefined() {
	return _create(new Matcher(), {
		matches: function (actual) {
			return !_isUndefined(actual);
		},
		describeTo: function (description) {
			description.append('defined');
		}
	});
}

IsDefined.defined = function () {
	return new IsDefined();
};

IsDefined.undefined = function () {
	return not(IsDefined.defined());
};

module.exports = IsDefined;
