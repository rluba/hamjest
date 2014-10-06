'use strict';

var _ = require('lodash');
var q = require('q');

function resolve(promises) {
	if (_.isArray(promises)) {
		return q.all(promises);
	} else {
		var result = {};
		_.forEach(promises, function (promiseOrValue, key) {
			result[key] = null;
			q(promiseOrValue).then(function (value) {
				result[key] = value;
			});
		});
		return q.all(_.toArray(promises)).then(function () {
			return result;
		});
	}
}

var promiseAgnostic = {
	matches: function (result, handler) {
		if (q.isPromiseAlike(result)) {
			return q(result).then(handler);
		} else {
			return handler(result);
		}
	},
	matchesAggregate: function (results, handler) {
		if (_.any(results, q.isPromiseAlike)) {
			return resolve(results).then(handler);
		} else {
			return handler(results);
		}
	},
	describeMismatchAggregate: function (results, handler, suffixFn) {
		if (_.any(results, q.isPromiseAlike)) {
			return resolve(results).then(function (results) {
				var sequence = q();
				_.forEach(results, function (result, key) {
					sequence = sequence.then(function () {
						return handler(result, key);
					});
				});
				if (suffixFn) {
					sequence = sequence.then(suffixFn);
				}
				return sequence;
			});
		} else {
			_.forEach(results, function (result, key) {
				return handler(result, key);
			});
			if (suffixFn) {
				suffixFn();
			}
		}
	},
	describeMismatch: function (result, handler, suffixFn) {
		if (q.isPromiseAlike(result)) {
			var response = q(result).then(handler);
			if (suffixFn) {
				response = response.then(suffixFn);
			}
			return response;
		} else {
			handler(result);
			if (suffixFn) {
				suffixFn();
			}
		}
	}
};

module.exports = promiseAgnostic;
