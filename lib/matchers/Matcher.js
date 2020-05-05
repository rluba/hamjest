'use strict';

const _ = require('lodash');

class Matcher {
	constructor(fns = {}) {
		_.extend(this, fns);
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
		return !_.isUndefined(valueOrMatcher) &&
			!_.isNull(valueOrMatcher) &&
			_.isFunction(valueOrMatcher.matches) &&
			_.isFunction(valueOrMatcher.describeTo) &&
			_.isFunction(valueOrMatcher.describeMismatch);
	}
}

module.exports = Matcher;
