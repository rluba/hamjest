'use strict';

const _ = require('lodash');

module.exports = function (start, end) {
	const __ = require('../..');

	if (_.isUndefined(end)) {
		end = start;
		start = 0;
	}

	__.assertThat('Start', start, __.is(__.number()));
	__.assertThat('End', end, __.is(__.number()));

	return _.create(__.number(), {
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
