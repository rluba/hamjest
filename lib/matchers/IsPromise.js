'use strict';

var _ = require('lodash-node')
	, q = require('q')
	, Matcher = require('./Matcher')
	;

function IsPromise() {
	return _.create(new Matcher(), {
		matches: function (actual) {
			return q.isPromise(actual);
		},
		describeTo: function (description) {
			description.append('promise');
		}
	});
}

IsPromise.promise = function () {
	return new IsPromise();
};

module.exports = IsPromise;
