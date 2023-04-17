'use strict';

const _create = require('lodash/create');
const Matcher = require('./Matcher');
const promiseAgnostic = require('./promiseAgnostic');
const asMatcher = require('../utils/asMatcher');

function IsNot(valueOrMatcher) {
	const innerMatcher = asMatcher(valueOrMatcher);
	return _create(new Matcher(), {
		matches: function (actual) {
			return promiseAgnostic.matches(innerMatcher.matches(actual), (result) => {
				return !result;
			});
		},
		describeTo: function (description) {
			description
				.append('not ')
				.appendDescriptionOf(innerMatcher);
		},
		describeMismatch: function (value, description) {
			description
				.append('was ')
				.appendValue(value);
		}
	});
}

IsNot.not = function (innerMatcher) {
	return new IsNot(innerMatcher);
};

module.exports = IsNot;
