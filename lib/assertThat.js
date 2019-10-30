'use strict';

const _ = require('lodash');
const AssertionError = require('assertion-error');
const Description = require('./Description');
const asMatcher = require('./utils/asMatcher');

const processArgs = (args) => {
	const hasThreeArgs = args.length === 3;
	const [reason, actual, maybeMatcher] = hasThreeArgs ? args : ['', ...args];
	return {reason, actual, matcher: asMatcher(maybeMatcher)};
};

const assertThat = (...args) => {
	const {reason, matcher, actual} = processArgs(args);
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
	} else {
		if (global && global.expect) {
			const expectation = global.expect();
			if (expectation && expectation.nothing) {
				expectation.nothing();
			}
		}
	}
};

module.exports = assertThat;
