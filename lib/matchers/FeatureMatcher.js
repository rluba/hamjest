'use strict';

const _create = require('lodash/create');
const Matcher = require('./Matcher');
const asMatcher = require('../utils/asMatcher');
const promiseAgnostic = require('./promiseAgnostic');

function FeatureMatcher(valueOrMatcher, featureDescription, featureName, featureFunction) {
	const matcher = asMatcher(valueOrMatcher);
	featureFunction = featureFunction || function (item) {
		return item[featureName];
	};

	return _create(new Matcher(), {
		matches: function (actual) {
			const featureValue = featureFunction(actual);
			return matcher.matches(featureValue);
		},
		describeTo: function (description) {
			description
				.append(featureDescription)
				.append(' ')
				.appendDescriptionOf(matcher);
		},
		describeMismatch: function (actual, description) {
			const featureValue = featureFunction(actual);
			return promiseAgnostic.describeMismatch(matcher.matches(featureValue), () => {
				description
					.append(featureName)
					.append(' ');
				return matcher.describeMismatch(featureValue, description);
			}, () => {
				description
					.append('\nfor ')
					.appendValue(actual);
			});
		}
	});
}

module.exports = FeatureMatcher;
