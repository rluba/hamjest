'use strict';

const _create = require('lodash/create');
const Matcher = require('./Matcher');
const asMatcher = require('../utils/asMatcher');

function Is(valueOrMatcher) {
	const innerMatcher = asMatcher(valueOrMatcher);
	return _create(new Matcher(), {
		matches: function (actualValue) {
			return innerMatcher.matches(actualValue);
		},
		describeTo: function (description) {
			description
				.append('is ')
				.appendDescriptionOf(innerMatcher);
		},
		describeMismatch: function (value, description) {
			return innerMatcher.describeMismatch(value, description);
		},
		getExpectedForDiff: innerMatcher.getExpectedForDiff,
		formatActualForDiff: innerMatcher.formatActualForDiff
	});
}

Is.is = function (innerMatcher) {
	return new Is(innerMatcher);
};

module.exports = Is;
