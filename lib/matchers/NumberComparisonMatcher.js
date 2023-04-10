'use strict';

const _create = require('lodash/create');
const IsNumber = require('./IsNumber');
const assertThat = require('../assertThat');
const is = require('./Is').is;
const number = require('./IsNumber').number;

function NumberComparisonMatcher(relation, threshold, matchesNumber) {
	assertThat(threshold, is(number()));

	return _create(new IsNumber(), {
		matchesSafely: function (actual) {
			return matchesNumber.call(this, actual);
		},
		describeTo: function (description) {
			description
				.append('a number ')
				.append(relation)
				.append(' ')
				.appendValue(threshold);
		},
		describeMismatchSafely: function (actual, description) {
			description
				.append('was ')
				.appendValue(actual);
		}
	});
}

NumberComparisonMatcher.greaterThan = function (threshold) {
	return new NumberComparisonMatcher('greater than', threshold, (actual) => actual > threshold);
};

NumberComparisonMatcher.greaterThanOrEqualTo = function (threshold) {
	return new NumberComparisonMatcher('greater than or equal to', threshold, (actual) => actual >= threshold);
};

NumberComparisonMatcher.lessThan = function (threshold) {
	return new NumberComparisonMatcher('less than', threshold, (actual) => actual < threshold);
};

NumberComparisonMatcher.lessThanOrEqualTo = function (threshold) {
	return new NumberComparisonMatcher('less than or equal to', threshold, (actual) => actual <= threshold);
};

module.exports = NumberComparisonMatcher;
