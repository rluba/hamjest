'use strict';

const _ = require('lodash');
const Bluebird = require('bluebird');

function resolve(promises) {
	if (_.isArray(promises)) {
		return Bluebird.all(promises);
	} else {
		return Bluebird.props(promises);
	}
}

const promiseAgnostic = {
	matches: function (result, handler) {
		if (isPromise(result)) {
			return Bluebird.resolve(result).then(handler);
		} else {
			return handler(result);
		}
	},
	matchesAggregate: function (results, handler) {
		if (_.some(results, isPromise)) {
			return resolve(results).then(handler);
		} else {
			return handler(results);
		}
	},
	describeMismatchAggregate: function (results, handler, suffixFn) {
		if (_.some(results, isPromise)) {
			return resolve(results).then((results) => {
				return _.reduce(results, (chain, result, key) => {
					return chain.then(() => handler(result, key));
				}, Bluebird.resolve());
			})
			.then(suffixFn || _.identity);
		} else {
			_.forEach(results, (result, key) => {
				return handler(result, key);
			});
			if (suffixFn) {
				suffixFn();
			}
		}
	},
	describeMismatch: function (result, handler, suffixFn) {
		if (isPromise(result)) {
			return Bluebird.resolve(result)
			.then(handler)
			.then(suffixFn || _.identity);
		} else {
			handler(result);
			if (suffixFn) {
				suffixFn();
			}
		}
	}
};

function isPromise(value) {
	return value && _.isFunction(value.then);
}

module.exports = promiseAgnostic;
