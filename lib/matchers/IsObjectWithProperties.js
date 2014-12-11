'use strict';

var _ = require('lodash')
	, IsObject = require('./IsObject')
	, asMatcher = require('./IsEqual').asMatcher
	, defined = require('./IsDefined').defined
	;
var Description = require('../Description');
var promiseAgnostic = require('./promiseAgnostic');

function IsObjectWithProperties(properties) {
	var propertyMatchers = _.mapValues(properties, asMatcher);
	return _.create(new IsObject(), {
		matchesSafely: function (actual) {
			var results = _.mapValues(propertyMatchers, function (matcher, key) {
				return matcher.matches(actual[key]);
			});

			return promiseAgnostic.matchesAggregate(results, _.all);
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
			var results = _.mapValues(propertyMatchers, function (matcher, key) {
				return matcher.matches(actual[key]);
			});

			var first = true;
			return promiseAgnostic.describeMismatchAggregate(results, function (result, key) {
				if (result) {
					return;
				}

				if (!first) {
					description.append(', ');
				}
				first = false;

				description
					.append(key)
					.append(' ');
				return propertyMatchers[key].describeMismatch(actual[key], description);
			});
		},

		getDiffItems: function (actual) {
			var expectedForDiff = _.pick(propertyMatchers, function (matcher, key) {
				return !matcher.matches(actual[key]);
			});
			expectedForDiff = _.mapValues(expectedForDiff, function (matcher, key) {
				if (_.isFunction(matcher.getDiffItems)) {
					return matcher.getDiffItems(actual[key]).expected;
				}
				if (_.isFunction(matcher.getExpectedForDiff)) {
					return matcher.getExpectedForDiff();
				}
				var description = new Description();
				matcher.describeTo(description);
				return description.get();
			});

			var actualForDiff = _.pick(actual, _.keys(expectedForDiff));
			actualForDiff = _.mapValues(actualForDiff, function (value, key) {
				var matcher = propertyMatchers[key];
				if (_.isFunction(matcher.getDiffItems)) {
					return matcher.getDiffItems(actual[key]).actual;
				}
				if (_.isFunction(matcher.formatActualForDiff)) {
					return matcher.formatActualForDiff(actual[key]);
				}
				return actual[key];
			});
			return {
				expected: expectedForDiff,
				actual: actualForDiff
			};
		}
	});
}

IsObjectWithProperties.hasProperties = function (properties) {
	return new IsObjectWithProperties(properties);
};

IsObjectWithProperties.hasProperty = function (name, valueOrMatcher) {
	var properties = {};
	properties[name] = _.isUndefined(valueOrMatcher) ? defined() : valueOrMatcher;
	return new IsObjectWithProperties(properties);
};

module.exports = IsObjectWithProperties;
