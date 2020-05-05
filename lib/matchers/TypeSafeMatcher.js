'use strict';

const Matcher = require('./Matcher');
const getType = require('../utils/getType');

class TypeSafeMatcher extends Matcher {
	constructor(fns) {
		super(fns);
	}
	matches(actual) {
		if (!this.isExpectedType(actual)) {
			return false;
		}
		return this.matchesSafely(actual);
	}
	describeMismatch(actual, description) {
		if (!this.isExpectedType(actual)) {
			if (!actual) {
				description.append('was ')
					.appendValue(actual);
				return;
			}

			description
				.append('was a ')
				.append(getType(actual))
				.append(' (')
				.appendValue(actual)
				.append(')');
		} else {
			return this.describeMismatchSafely(actual, description);
		}
	}
	isExpectedType() {
		throw new Error('Not implemented');
	}
	matchesSafely() {
		return true;
	}
	describeMismatchSafely() {
		throw new Error('Not implemented');
	}
}

module.exports = TypeSafeMatcher;
