'use strict';

var q = require('q');
var _ = require('lodash');
var AssertionError = require('assertion-error')
	, Description = require('./Description')
	;

function assertThat(reason, actual, matcher) {
	if (arguments.length === 2) {
		matcher = actual;
		actual = reason;
		reason = '';
	}

	var matches = matcher.matches(actual);

	if (q.isPromiseAlike(matches)) {
		throw new AssertionError('Matcher returned a promise instead of a boolean - use promiseThat for promising matchers!', {}, assertThat);
	}

	if (!matches) {
		var description = new Description();
		description.append(reason)
			.append('\nExpected: ')
			.appendDescriptionOf(matcher)
			.append('\n     but: ');

		var props = {
			showDiff: true
		};
		if (_.has(matcher, 'getExpectedForDiff')) {
			props.expected = matcher.getExpectedForDiff();
		}
		if (_.has(matcher, 'formatActualForDiff')) {
			props.actual = matcher.formatActualForDiff(actual);
		}

		matcher.describeMismatch(actual, description);
		throw new AssertionError(description.get(), props, assertThat);
	}
}

module.exports = assertThat;
