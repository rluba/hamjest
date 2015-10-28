'use strict';

var asMatcher = require('./IsEqual').asMatcher;
var getType = require('../utils/getType');
var getTypeName = require('../utils/getTypeName');

module.exports = function typedError(errorType, messageMatcherOrValue) {
	var messageMatcher = asMatcher(messageMatcherOrValue);
	return {
		matches: function (actual) {
			return actual instanceof errorType &&
				messageMatcher.matches(actual.message);
		},
		describeTo: function (description) {
			description
				.append('an error of type ')
				.append(getTypeName(errorType))
				.append(' with message ')
				.appendDescriptionOf(messageMatcher);
		},
		describeMismatch: function (actual, description) {
			if (!actual) {
				description
					.append('was ')
					.appendValue(actual);
				return;
			}

			var hadTypeError;
			if (!(actual instanceof errorType)) {
				hadTypeError = true;
				description
					.append('type was ')
					.append(getType(actual));
			}
			if (!messageMatcher.matches(actual.message)) {
				if (hadTypeError) {
					description.append(', ');
				}
				description.append('message ');
				messageMatcher.describeMismatch(actual.message, description);
			}
		}
	};
};
