'use strict';

const _ = require('lodash');
const AssertionError = require('assertion-error');
const Description = require('./Description');
const {isMatcher} = require('./matchers/Matcher');
const {equalTo} = require('./matchers/IsEqual');

function assertThat(reason, actual, matcher) {
	if (arguments.length === 2) {
		matcher = actual;
		actual = reason;
		reason = '';
	}

	if (!isMatcher(matcher)) {
		matcher = equalTo(matcher);
	}

	const matches = matcher.matches(actual);

	if (matches && _.isFunction(matches.then)) {
		throw new AssertionError('Matcher returned a promise instead of a boolean - use promiseThat for promising matchers!', {}, assertThat);
	}

	if (!matches) {
		const description = new Description();
		description.append(reason)
			.append('\nExpected: ')
			.appendDescriptionOf(matcher)
			.append('\n     but: ');
		matcher.describeMismatch(actual, description);

		let errorProperties = {};
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
