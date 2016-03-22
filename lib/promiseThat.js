'use strict';

const q = require('q');
const AssertionError = require('assertion-error');
const Description = require('./Description');
const _ = require('lodash');

function promiseThat(reason, actual, matcher) {
	if (arguments.length === 2) {
		matcher = actual;
		actual = reason;
		reason = '';
	}

	return q(matcher.matches(actual)).then((result) => {
		if (!result) {
			const description = new Description();
			description.append(reason)
				.append('\nExpected: ')
				.appendDescriptionOf(matcher)
				.append('\n     but: ');
			return q(matcher.describeMismatch(actual, description)).then(() => {
				if (!_.isFunction(matcher.getExpectedForDiff) ||
					!_.isFunction(matcher.formatActualForDiff)) {
					return {};
				}

				return q.all([
					matcher.getExpectedForDiff(),
					matcher.formatActualForDiff(actual)
				]).spread((expected, actual) => {
					return {
						showDiff: true,
						expected: expected,
						actual: actual
					};
				});
			}).then((errorProperties) => {
				throw new AssertionError(description.get(), errorProperties, promiseThat);
			});
		}
	});
}

module.exports = promiseThat;
