'use strict';

const _create = require('lodash/create');
const IsDate = require('./IsDate');
const assertThat = require('../assertThat');
const is = require('./Is').is;
const date = require('./IsDate').date;

function DateComparisonMatcher(threshold, relation, matchesNumber) {
	assertThat(threshold, is(date()));

	return _create(new IsDate(), {
		matchesSafely: function (actual) {
			return matchesNumber.call(this, actual);
		},
		describeTo: function (description) {
			description
				.append('a date ')
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

DateComparisonMatcher.after = function (threshold) {
	return new DateComparisonMatcher(threshold, 'after', (actual) => {
		return actual > threshold;
	});
};

DateComparisonMatcher.afterOrEqualTo = function (threshold) {
	return new DateComparisonMatcher(threshold, 'after or equal to', (actual) => {
		return actual >= threshold;
	});
};

DateComparisonMatcher.before = function (threshold) {
	return new DateComparisonMatcher(threshold, 'before', (actual) => {
		return actual < threshold;
	});
};

DateComparisonMatcher.beforeOrEqualTo = function (threshold) {
	return new DateComparisonMatcher(threshold, 'before or equal to', (actual) => {
		return actual <= threshold;
	});
};

module.exports = DateComparisonMatcher;
