'use strict';

const _forEach = require('lodash/forEach');
const _identity = require('lodash/identity');
const _isArray = require('lodash/isArray');
const _isFunction = require('lodash/isFunction');
const _reduce = require('lodash/reduce');
const _some = require('lodash/some');
const Bluebird = require('bluebird');

function resolve(promises) {
	if (_isArray(promises)) {
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
				}, Bluebird.resolve());
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
			return Bluebird.resolve(result)
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
