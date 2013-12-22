'use strict';

var AssertionError = require('assertion-error')
	, q = require('q')
	, Description = require('./description')
	;

var asserts = {
	assertThat: function (reason, actual, matcher) {
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
			throw new AssertionError(description.get(), {}, asserts.assertThat);
		}
	},
	promiseThat: function (promiseOrValue, matcher, message) {
		return q(promiseOrValue).then(function (value) {
			asserts.assertThat(value, matcher, message);
		});
	}
};

module.exports = asserts;
