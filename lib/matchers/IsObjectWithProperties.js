'use strict';

var _ = require('lodash');
var IsObject = require('./IsObject');
var asMatcher = require('../utils/asMatcher');
var defined = require('./IsDefined').defined;
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
			var describeVerbose = this.describeVerbose;
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
			}, function () {
				if (describeVerbose) {
					description.append('\n\tfor ')
						.appendValue(actual);
				}
			});
		},
		verbose: function () {
			this.describeVerbose = true;
			return this;
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
