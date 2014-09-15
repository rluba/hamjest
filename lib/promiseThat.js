'use strict';

var q = require('q');
var AssertionError = require('assertion-error');
var Description = require('./Description');

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
			matcher.describeMismatch(actual, description);
			throw new AssertionError(description.get(), {}, promiseThat);
		}
	});
}

module.exports = promiseThat;

