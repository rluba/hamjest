'use strict';

const _ = require('lodash');
const q = require('q');

function resolve(promises) {
	if (_.isArray(promises)) {
		return q.all(promises);
	}
	else {
		const result = {};
		_.forEach(promises, (promiseOrValue, key) => {
			result[key] = null;
			q(promiseOrValue).then((value) => {
				result[key] = value;
			});
		});
		return q.all(_.toArray(promises)).then(() => result);
	}
}

const promiseAgnostic = {
	matches: function (result, handler) {
		if (q.isPromiseAlike(result)) {
			return q(result).then(handler);
		}
		else {
			return handler(result);
		}
	},
	matchesAggregate: function (results, handler) {
		if (_.any(results, q.isPromiseAlike)) {
			return resolve(results).then(handler);
		}
		else {
			return handler(results);
		}
	},
	describeMismatchAggregate: function (results, handler, suffixFn) {
		if (_.any(results, q.isPromiseAlike)) {
			return resolve(results).then((results) => {
				let sequence = q();
				_.forEach(results, (result, key) => {
					sequence = sequence.then(() => {
						return handler(result, key);
					});
				});
				if (suffixFn) {
					sequence = sequence.then(suffixFn);
				}
				return sequence;
			});
		}
		else {
			_.forEach(results, (result, key) => {
				return handler(result, key);
			});
			if (suffixFn) {
				suffixFn();
			}
		}
	},
	describeMismatch: function (result, handler, suffixFn) {
		if (q.isPromiseAlike(result)) {
			let response = q(result).then(handler);
			if (suffixFn) {
				response = response.then(suffixFn);
			}
			return response;
		}
		else {
			handler(result);
			if (suffixFn) {
				suffixFn();
			}
		}
	}
};

module.exports = promiseAgnostic;
