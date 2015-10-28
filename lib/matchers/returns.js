'use strict';

var _ = require('lodash');
var func = require('./IsFunction').func;
var anything = require('./IsAnything').anything;
var asMatcher = require('./IsEqual').asMatcher;
var getType = require('../utils/getType');

module.exports = function returns(resultMatcherOrValue) {
	var resultMatcher = resultMatcherOrValue ? asMatcher(resultMatcherOrValue) : anything();
	return _.create(new func(), {
		matchesSafely: function (actual) {
			try {
				var result = actual();
				return resultMatcher.matches(result);
			}
			catch (e) {
				return false;
			}
		},
		describeTo: function (description) {
			description.append('a function returning ')
				.appendDescriptionOf(resultMatcher);
		},
		describeMismatchSafely: function (actual, description) {
			try {
				var result = actual();
				description.append('return value ');
				return resultMatcher.describeMismatch(result, description);
			}
			catch (e) {
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
