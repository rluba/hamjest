'use strict';

var _ = require('lodash');
var q = require('q');

var promiseAgnostic = {
	matchAggregate: function (results, handler) {
		if (_.any(results, q.isPromiseAlike)) {
			return q.all(results).then(handler);
		} else {
			return handler(results);
		}
	},
	describeAggregate: function (results, handler) {
		if (_.any(results, q.isPromiseAlike)) {
			return q.all(results).then(function (results) {
				var sequence = q();
				_.forEach(results, function (result, key) {
					sequence = sequence.then(function () {
						return handler(result, key);
					});
				});
				return sequence;
			});
		} else {
			_.forEach(results, function (result, key) {
				return handler(result, key);
			});
		}
	}
};

module.exports = promiseAgnostic;
