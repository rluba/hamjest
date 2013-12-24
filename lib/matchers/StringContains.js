'use strict';

var _ = require('lodash-node')
	, Matcher = require('./Matcher')
	;

var StringContains = function (substring) {
	Matcher.call(this, {
		matches: function (actualValue) {
			return _.isString(actualValue) && actualValue.indexOf(substring) !== -1;
		},
		describeTo: function (description) {
			description.append('a string containing ').appendValue(substring);
		},
		describeMismatch: function (actual, description) {
			if (_.isString(actual)) {
				description.append('was ').appendValue(actual);
			}
			else {
				description.append('was a ')
					.append(typeof actual)
					.append(' (')
					.appendValue(actual)
					.append(')');
			}
		}
	});
};
StringContains.prototype = _.create(Matcher.prototype, { 'constructor': StringContains });

var containsString = function (substring) {
	return new StringContains(substring);
};

module.exports = {
	StringContains: StringContains,
	containsString: containsString
};
