'use strict';

var _ = require('lodash-node')
	, Matcher = require('./Matcher')
	;

var IsAnything = function () {
	return _.create(new Matcher(), {
		matches: function () {
			return true;
		},
		describeTo: function (description) {
			description.append('anything');
		}
	});
};

module.exports = {
	IsAnything: IsAnything,
	anything: function () {
		return new IsAnything();
	}
};
