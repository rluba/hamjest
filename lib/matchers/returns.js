'use strict';

const _ = require('lodash');
const anything = require('./IsAnything').anything;
const asMatcher = require('../utils/asMatcher');
const func = require('./IsFunction').func;
const getType = require('../utils/getType');

module.exports = function returns(resultValueOrMatcher) {
	const resultMatcher = resultValueOrMatcher ? asMatcher(resultValueOrMatcher) : anything();
	return _.create(func(), {
		matchesSafely: function (actual) {
			try {
				const result = actual();
				return resultMatcher.matches(result);
			} catch (e) {
				return false;
			}
		},
		describeTo: function (description) {
			description.append('a function returning ')
				.appendDescriptionOf(resultMatcher);
		},
		describeMismatchSafely: function (actual, description) {
			try {
				const result = actual();
				description.append('return value ');
				return resultMatcher.describeMismatch(result, description);
			} catch (e) {
				description.append('function threw ')
					.append(getType(e));
				if (e.message) {
					description.append(': ')
						.appendValue(e.message);
				}
			}
		}
	});
};
