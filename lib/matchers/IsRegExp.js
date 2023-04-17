'use strict';

const _isRegExp = require('lodash/isRegExp');
const TypeSafeMatcher = require('./TypeSafeMatcher');

class IsRegExp extends TypeSafeMatcher {
	isExpectedType(actual) {
		return _isRegExp(actual);
	}
	describeTo(description) {
		description
			.append('a regular expression');
	}
	static regExp() {
		return new IsRegExp();
	}
}

module.exports = IsRegExp;
