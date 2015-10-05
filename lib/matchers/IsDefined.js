'use strict';

var _ = require('lodash');
var Matcher = require('./Matcher');
var not = require('./IsNot').not;

function IsDefined() {
	return _.create(new Matcher(), {
		matches: function (actual) {
			return !_.isUndefined(actual);
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
