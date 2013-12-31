'use strict';

var _ = require('lodash-node')
	, Matcher = require('./Matcher')
	, asMatcher = require('./IsEqual').asMatcher
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
			description
				.append(featureName)
				.append(' of ')
				.appendValue(actual)
				.append(' ');
			matcher.describeMismatch(featureFunction(actual), description);
		}
	});
}

module.exports = FeatureMatcher;
