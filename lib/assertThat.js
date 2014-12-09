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
		matcher.describeMismatch(actual, description);

		var errorProperties = {};
		if (_.isFunction(matcher.getExpectedForDiff) &&
			_.isFunction(matcher.formatActualForDiff)) {
			errorProperties = {
				showDiff: true,
				expected: matcher.getExpectedForDiff(),
				actual: matcher.formatActualForDiff(actual)
			};
		}

		throw new AssertionError(description.get(), errorProperties, assertThat);
	}
}

module.exports = assertThat;
