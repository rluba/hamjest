'use strict';

const _ = require('lodash');
const __ = require('../..');

const TestMatcher = function (matchesFn) {
	matchesFn = matchesFn || (() => true);
	return _.create(new __.Matcher(), {
		matches: matchesFn,
		describeTo: function (description) {
			description.append('Matcher description');
		}
	});
};

module.exports = TestMatcher;
