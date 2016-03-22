'use strict';

const _ = require('lodash');
const IsNumber = require('./IsNumber');
const assertThat = require('../assertThat');
const is = require('./Is').is;
const number = require('./IsNumber').number;

function NumberComparisonMatcher(relation, threshold, matchesNumber) {
	assertThat(threshold, is(number()));

	return _.create(new IsNumber(), {
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

_.extend(NumberComparisonMatcher, {
	greaterThan: function (threshold) {
		return new NumberComparisonMatcher('greater than', threshold, (actual) => actual > threshold);
	},
	greaterThanOrEqualTo: function (threshold) {
		return new NumberComparisonMatcher('greater than or equal to', threshold, (actual) => actual >= threshold);
	},
	lessThan: function (threshold) {
		return new NumberComparisonMatcher('less than', threshold, (actual) => actual < threshold);
	},
	lessThanOrEqualTo: function (threshold) {
		return new NumberComparisonMatcher('less than or equal to', threshold, (actual) => actual <= threshold);
	}
});

module.exports = NumberComparisonMatcher;
