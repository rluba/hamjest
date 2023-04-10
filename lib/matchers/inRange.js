'use strict';

const _ = require('lodash');
const assertThat = require('../assertThat');
const is = require('../matchers/Is').is;
const isNumber = require('../matchers/IsNumber').number;

module.exports = function (start, end) {
	if (_.isUndefined(end)) {
		end = start;
		start = 0;
	}

	assertThat('Start', start, is(isNumber()));
	assertThat('End', end, is(isNumber()));

	return _.create(isNumber(), {
		matchesSafely: function (actual) {
			return _.inRange(actual, start, end);
		},
		describeTo: function (description) {
			description
				.append('a number in range [')
				.append(start)
				.append(', ')
				.append(end)
				.append(')');
		},
		describeMismatchSafely: function (actual, description) {
			description
				.append('was ')
				.appendValue(actual);
		}
	});
};
