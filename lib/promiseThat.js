'use strict';

var q = require('q');
var AssertionError = require('assertion-error');
var Description = require('./Description');
var _ = require('lodash');

function promiseThat(reason, actual, matcher) {
	if (arguments.length === 2) {
		matcher = actual;
		actual = reason;
		reason = '';
	}

	return q(matcher.matches(actual)).then(function (result) {
		if (!result) {
			var description = new Description();
			description.append(reason)
				.append('\nExpected: ')
				.appendDescriptionOf(matcher)
				.append('\n     but: ');
			return q(matcher.describeMismatch(actual, description)).then(function () {
				if (!_.isFunction(matcher.getExpectedForDiff) ||
					!_.isFunction(matcher.formatActualForDiff)) {
					return {};
				}

				return q.all([
					matcher.getExpectedForDiff(),
					matcher.formatActualForDiff(actual)
				]).spread(function (expected, actual) {
					return {
						showDiff: true,
						expected: expected,
						actual: actual
					};
				});
			}).then(function (errorProperties) {
				throw new AssertionError(description.get(), errorProperties, promiseThat);
			});
		}
	});
}

module.exports = promiseThat;

