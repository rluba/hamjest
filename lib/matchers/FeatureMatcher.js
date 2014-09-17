'use strict';

var _ = require('lodash')
	, Matcher = require('./Matcher')
	, asMatcher = require('./IsEqual').asMatcher
	, q = require('q')
	;

function FeatureMatcher(valueOrMatcher, featureDescription, featureName, featureFunction) {
	var matcher = asMatcher(valueOrMatcher);
	featureFunction = featureFunction || function (item) {
		return item[featureName];
	};

	return _.create(new Matcher(), {
		matches: function (actual) {
			var featureValue = featureFunction(actual);
			return matcher.matches(featureValue);
		},
		describeTo: function (description) {
			description
				.append(featureDescription)
				.append(' ')
				.appendDescriptionOf(matcher);
		},
		describeMismatch: function (actual, description) {
			function appendSuffix() {
				description
					.append('\nfor ')
					.appendValue(actual);
			}

			description
				.append(featureName)
				.append(' ');
			var promise = matcher.describeMismatch(featureFunction(actual),description);
			if (q.isPromise(promise)) {
				return promise.then(appendSuffix);
			} else {
				appendSuffix();
			}
		}
	});
}

module.exports = FeatureMatcher;
