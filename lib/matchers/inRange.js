'use strict';

const _create = require('lodash/create');
const _inRange = require('lodash/inRange');
const _isUndefined = require('lodash/isUndefined');
const assertThat = require('../assertThat');
const is = require('../matchers/Is').is;
const isNumber = require('../matchers/IsNumber').number;

module.exports = function (start, end) {
	if (_isUndefined(end)) {
		end = start;
		start = 0;
	}

	assertThat('Start', start, is(isNumber()));
	assertThat('End', end, is(isNumber()));

	return _create(isNumber(), {
		matchesSafely: function (actual) {
			return _inRange(actual, start, end);
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
