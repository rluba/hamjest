'use strict';

var _ = require('lodash-node')
	, q = require('q')
	, Matcher = require('./Matcher')
	;

var IsPromise = function () {
	return _.create(new Matcher(), {
		matches: function (actual) {
			return q.isPromise(actual);
		},
		describeTo: function (description) {
			description.append('promise');
		}
	});
};

module.exports = {
	IsPromise: IsPromise,
	promise: function () {
		return new IsPromise();
	}
};
