'use strict';

const _ = require('lodash');
const Matcher = require('./Matcher');
const getType = require('../utils/getType');

function TypeSafeMatcher() {
	return _.create(new Matcher(), {
		matches: function (actual) {
			if (!this.isExpectedType(actual)) {
				return false;
			}
			return this.matchesSafely(actual);
		},
		describeMismatch: function (actual, description) {
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
		},
		isExpectedType: function () {
			throw new Error('Not implemented');
		},
		matchesSafely: function () {
			return true;
		},
		describeMismatchSafely: function () {
			throw new Error('Not implemented');
		}
	});
}

module.exports = TypeSafeMatcher;
