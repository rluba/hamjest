'use strict';

var _ = require('lodash');
var __ = require('../..');

var TestMatcher = function (matchesFn) {
	matchesFn = matchesFn || function () { return true; };
	return _.create(new __.Matcher(), {
		matches: matchesFn,
		describeTo: function (description) {
			description.append('Matcher description');
		}
	});
};

module.exports = TestMatcher;
