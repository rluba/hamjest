'use strict';

const _ = require('lodash');
const TypeSafeMatcher = require('./TypeSafeMatcher');

class IsRegExp extends TypeSafeMatcher {
	isExpectedType(actual) {
		return _.isRegExp(actual);
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
