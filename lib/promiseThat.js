'use strict';

const _isFunction = require('lodash/isFunction');
const AssertionError = require('assertion-error');
const Description = require('./Description');

function promiseThat(reason, actual, matcher) {
	if (arguments.length === 2) {
		matcher = actual;
		actual = reason;
		reason = '';
	}

	return Promise.resolve().then(() => matcher.matches(actual)).then((result) => {
		if (!result) {
			const description = new Description();
			description.append(reason)
				.append('\nExpected: ')
				.appendDescriptionOf(matcher)
				.append('\n     but: ');
			return Promise.resolve().then(() => matcher.describeMismatch(actual, description))
			.then(() => {
				if (!_isFunction(matcher.getExpectedForDiff) ||
					!_isFunction(matcher.formatActualForDiff)) {
					return {};
				}

				return Promise.all([
					matcher.getExpectedForDiff(),
					matcher.formatActualForDiff(actual)
				]).then(([expected, actual]) => {
					return {
						showDiff: true,
						expected: expected,
						actual: actual
					};
				});
			})
			.then((errorProperties) => {
				throw new AssertionError(description.get(), errorProperties, promiseThat);
			});
		}
	});
}

module.exports = promiseThat;
