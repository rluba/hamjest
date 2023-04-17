'use strict';

const _forEach = require('lodash/forEach');
const _identity = require('lodash/identity');
const _isArray = require('lodash/isArray');
const _isFunction = require('lodash/isFunction');
const _reduce = require('lodash/reduce');
const _some = require('lodash/some');

function resolve(promises) {
	if (_isArray(promises)) {
		return Promise.all(promises);
	} else {
		return Promise.resolve(promises)
			.then((object) =>
				Promise.all(
					Object.entries(object).map(([key, value]) =>
						Promise.resolve(value).then((value) => [key, value])
					)
				)
			)
			.then((items) => {
				const results = {};

				for (const [key, value] of items) {
					results[key] = value;
				}

				return results;
			});
	}
}

const promiseAgnostic = {
	matches: function (result, handler) {
		if (isPromise(result)) {
			return Promise.resolve(result).then(handler);
		} else {
			return handler(result);
		}
	},
	matchesAggregate: function (results, handler) {
		if (_some(results, isPromise)) {
			return resolve(results).then(handler);
		} else {
			return handler(results);
		}
	},
	describeMismatchAggregate: function (results, handler, suffixFn) {
		if (_some(results, isPromise)) {
			return resolve(results).then((results) => {
				return _reduce(results, (chain, result, key) => {
					return chain.then(() => handler(result, key));
				}, Promise.resolve());
			})
			.then(suffixFn || _identity);
		} else {
			_forEach(results, (result, key) => {
				return handler(result, key);
			});
			if (suffixFn) {
				suffixFn();
			}
		}
	},
	describeMismatch: function (result, handler, suffixFn) {
		if (isPromise(result)) {
			return Promise.resolve(result)
			.then(handler)
			.then(suffixFn || _identity);
		} else {
			handler(result);
			if (suffixFn) {
				suffixFn();
			}
		}
	}
};

function isPromise(value) {
	return value && _isFunction(value.then);
}

module.exports = promiseAgnostic;
