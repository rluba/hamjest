'use strict';

const _ = require('lodash');
const Matcher = require('./Matcher');
const acceptingMatcher = require('../utils/acceptingMatcher');
const promiseAgnostic = require('./promiseAgnostic');

const IsNot = acceptingMatcher((innerMatcher) => {
	return _.create(new Matcher(), {
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
});

IsNot.not = function (innerMatcher) {
	return new IsNot(innerMatcher);
};

module.exports = IsNot;
