'use strict';

const _create = require('lodash/create');
const _isObject = require('lodash/isObject');
const _isString = require('lodash/isString');
const _size = require('lodash/size');
const TypeSafeMatcher = require('./TypeSafeMatcher');
const FeatureMatcher = require('./FeatureMatcher');

module.exports = function (valueOrMatcher) {
	const innerMatcher = new FeatureMatcher(valueOrMatcher, 'a collection or string with size', 'size', (item) => _size(item));
	return _create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _isString(actual) || _isObject(actual);
		},
		matchesSafely: innerMatcher.matches,
		describeTo: innerMatcher.describeTo,
		describeMismatchSafely: innerMatcher.describeMismatch
	});
};
