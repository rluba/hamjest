'use strict';

var _ = require('lodash-node')
	, q = require('q')
	, Matcher = require('./Matcher')
	;

var IsPromise = function () {
	Matcher.call(this, {
		matches: function (actual) {
			return q.isPromise(actual);
		},
		describeTo: function (description) {
			description.append('promise');
		}
	});
};
IsPromise.prototype = _.create(Matcher.prototype, { 'constructor': IsPromise });

module.exports = {
	IsPromise: IsPromise,
	promise: function () {
		return new IsPromise();
	}
};
