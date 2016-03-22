'use strict';

const _ = require('lodash');
const IsDate = require('./IsDate');
const assertThat = require('../assertThat');
const is = require('./Is').is;
const date = require('./IsDate').date;

function DateComparisonMatcher(threshold, relation, matchesNumber) {
	assertThat(threshold, is(date()));

	return _.create(new IsDate(), {
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

_.extend(DateComparisonMatcher, {
	after: function (threshold) {
		return new DateComparisonMatcher(threshold, 'after', (actual) => {
			return actual > threshold;
		});
	},
	afterOrEqualTo: function (threshold) {
		return new DateComparisonMatcher(threshold, 'after or equal to', (actual) => {
			return actual >= threshold;
		});
	},
	before: function (threshold) {
		return new DateComparisonMatcher(threshold, 'before', (actual) => {
			return actual < threshold;
		});
	},
	beforeOrEqualTo: function (threshold) {
		return new DateComparisonMatcher(threshold, 'before or equal to', (actual) => {
			return actual <= threshold;
		});
	}
});

module.exports = DateComparisonMatcher;
