'use strict';

var _ = require('lodash-node')
	, TypeSafeMatcher = require('./TypeSafeMatcher')
	, asMatcher = require('./IsEqual').asMatcher
	;

function IsObjectWithProperties(properties) {
	var propertyMatchers = _.mapValues(properties, asMatcher);
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isObject(actual);
		},
		matchesSafely: function (actual) {
			var matched = true;
			_.forEach(propertyMatchers, function (matcher, key) {
				if (!matcher.matches(actual[key])) {
					matched = false;
					return false;
				}
			});
			return matched;
		},
		describeTo: function (description) {
			description.append('an object with {');

			var first = true;
			_.forEach(propertyMatchers, function (matcher, key) {
				if (!first) {
					description.append(', ');
				}
				first = false;

				description
					.append(key)
					.append(': ')
					.appendDescriptionOf(matcher);
			});

			description.append('}');
		},
		describeMismatchSafely: function (actual, description) {
			var first = true;
			_.forEach(propertyMatchers, function (matcher, key) {
				var propertyValue = actual[key];
				if (!matcher.matches(propertyValue)) {
					if (!first) {
						description.append(', ');
					}
					first = false;

					description
						.append(key)
						.append(' ');
					matcher.describeMismatch(actual[key], description);
				}
			});
		}
	});
}

IsObjectWithProperties.hasProperties = function (properties) {
	return new IsObjectWithProperties(properties);
};

IsObjectWithProperties.hasProperty = function (name, valueOrMatcher) {
	var properties = {};
	properties[name] = valueOrMatcher;
	return new IsObjectWithProperties(properties);
};

module.exports = IsObjectWithProperties;
