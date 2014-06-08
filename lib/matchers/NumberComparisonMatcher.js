'use strict';

var _ = require('lodash')
	, IsNumber = require('./IsNumber')
	, assertThat = require('../assertThat')
	, is = require('./Is').is
	, number = require('./IsNumber').number
	;

function NumberComparisonMatcher(threshold, relation, matchesNumber) {
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
		return new NumberComparisonMatcher(threshold, 'greater than', function (actual) {
			return actual > threshold;
		});
	},
	greaterThanOrEqualTo: function (threshold) {
		return new NumberComparisonMatcher(threshold, 'greater than or equal to', function (actual) {
			return actual >= threshold;
		});
	},
	lessThan: function (threshold) {
		return new NumberComparisonMatcher(threshold, 'less than', function (actual) {
			return actual < threshold;
		});
	},
	lessThanOrEqualTo: function (threshold) {
		return new NumberComparisonMatcher(threshold, 'less than or equal to', function (actual) {
			return actual <= threshold;
		});
	}
});

module.exports = NumberComparisonMatcher;
