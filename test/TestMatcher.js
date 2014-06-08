'use strict';

var _ = require('lodash')
	, Matcher = require('../lib/matchers/matcher')
	;

var TestMatcher = function (matchesFn) {
	matchesFn = matchesFn || function () { return true; };
	return _.create(new Matcher(), {
		matches: matchesFn,
		describeTo: function (description) {
			description.append('Matcher description');
		}
	});
};

module.exports = TestMatcher;
