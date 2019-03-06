'use strict';

const asMatcher = require('../utils/asMatcher');
const getType = require('../utils/getType');
const getTypeName = require('../utils/getTypeName');

module.exports = function typedError(errorType, messageValueOrMatcher) {
	const messageMatcher = asMatcher(messageValueOrMatcher);
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

			let hadTypeError;
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
