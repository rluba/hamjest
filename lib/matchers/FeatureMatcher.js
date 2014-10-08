'use strict';

var _ = require('lodash')
	, Matcher = require('./Matcher')
	, asMatcher = require('./IsEqual').asMatcher
	;

var promiseAgnostic = require('./promiseAgnostic');

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
			var featureValue = featureFunction(actual);
			return promiseAgnostic.describeMismatch(matcher.matches(featureValue), function () {
				description
					.append(featureName)
					.append(' ');
				return matcher.describeMismatch(featureValue, description);
			}, function () {
				description
					.append('\nfor ')
					.appendValue(actual);
			});
		}
	});
}

module.exports = FeatureMatcher;
