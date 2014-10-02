'use strict';

var _ = require('lodash')
	, IsObject = require('./IsObject')
	, asMatcher = require('./IsEqual').asMatcher
	, defined = require('./IsDefined').defined
	, q = require('q')
	;

function IsPromiseWithProperties(properties) {
	var objectMatcher = new IsObject();
	var propertyMatchers = _.mapValues(properties, asMatcher);
	return {
		matches: function (actual) {
			return q(actual).then(function (actual) {
				if (!objectMatcher.matches(actual)) {
					return [false];
				}

				return q.all(_.map(propertyMatchers, function (matcher, key) {
					return matcher.matches(actual[key]);
				}));
			}).then(function (results) {
				return _.all(results);
			});
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
		describeMismatch: function (actual, description) {
			if (!objectMatcher.matches(actual)) {
				return q(objectMatcher.describeMismatch(actual, description));
			}

			var sequencePromise = q();
			var first = true;
			_.forEach(propertyMatchers, function (matcher, key) {
				sequencePromise = sequencePromise.then(function () {
					var propertyValue = actual[key];
					return q(matcher.matches(propertyValue)).then(function (matches) {
						if (matches) {
							return;
						}

						if (!first) {
							description.append(', ');
						}
						first = false;

						description
							.append(key)
							.append(' ');
						return matcher.describeMismatch(propertyValue, description);
					});
				});
			});
			return sequencePromise;
		}
	};
}

function willHaveProperties(properties) {
	return new IsPromiseWithProperties(properties);
}

willHaveProperties.willHaveProperty = function (name, valueOrMatcher) {
	var properties = {};
	properties[name] = _.isUndefined(valueOrMatcher) ? defined() : valueOrMatcher;
	return new IsPromiseWithProperties(properties);
};

module.exports = willHaveProperties;
