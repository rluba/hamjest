'use strict';

var AssertionError = require('assertion-error')
	, Description = require('./description')
	;

var assertThat = function (reason, actual, matcher) {
	if(arguments.length === 2) {
		matcher = actual;
		actual = reason;
		reason = '';
	}

	if(!matcher.matches(actual)) {
		var description = new Description();
		description.append(reason)
			.append('\nExpected: ')
			.appendDescriptionOf(matcher)
			.append('\n     but: ');
		matcher.describeMismatch(actual, description);
		throw new AssertionError(description.get(), {}, assertThat);
	}
};

module.exports = assertThat;
