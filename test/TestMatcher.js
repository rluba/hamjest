'use strict';

var _ = require('lodash-node')
	, Matcher = require('../lib/matcher')
	;

var TestMatcher = function (matchesFn) {
	matchesFn = matchesFn || function () { return true; };
	Matcher.call(this, {
		matches: matchesFn,
		describeTo: function (description) {
			description.append('Matcher description');
		}
	});
};
TestMatcher.prototype = _.create(Matcher.prototype, { 'constructor': TestMatcher });

module.exports = TestMatcher;
