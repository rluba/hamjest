'use strict';

const _extend = require('lodash/extend');
const _isFunction = require('lodash/isFunction');
const _isNull = require('lodash/isNull');
const _isUndefined = require('lodash/isUndefined');

class Matcher {
	constructor(fns = {}) {
		_extend(this, fns);
	}
	matches() {
		throw new Error('Not implemented');
	}
	describeTo() {
		throw new Error('Not implemented');
	}
	describeMismatch(value, description) {
		description.append('was ').appendValue(value);
	}
	static isMatcher(valueOrMatcher) {
		return !_isUndefined(valueOrMatcher) &&
			!_isNull(valueOrMatcher) &&
			_isFunction(valueOrMatcher.matches) &&
			_isFunction(valueOrMatcher.describeTo) &&
			_isFunction(valueOrMatcher.describeMismatch);
	}
}

module.exports = Matcher;
