'use strict';

const _ = require('lodash');
const Description = require('./../Description');
const TypeSafeMatcher = require('./TypeSafeMatcher');
const asMatcher = require('../utils/asMatcher');
const isMatcher = require('./Matcher').isMatcher;

module.exports = function (valueOrMatcher) {
	const descriptionMatcher = asMatcher(valueOrMatcher);
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return isMatcher(actual);
		},
		matchesSafely: function (actual) {
			const actualDescription = new Description()
				.appendDescriptionOf(actual)
				.get();
			return descriptionMatcher.matches(actualDescription);
		},
		describeTo: function (description) {
			description.append('a matcher with description: ')
				.appendDescriptionOf(descriptionMatcher);
		},
		describeMismatchSafely: function (actual, description) {
			description.append('matcher description ');
			const actualDescription = new Description()
				.appendDescriptionOf(actual)
				.get();
			descriptionMatcher.describeMismatch(actualDescription, description);
		}
	});
};
