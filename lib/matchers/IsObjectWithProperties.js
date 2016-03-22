'use strict';

const _ = require('lodash');
const IsObject = require('./IsObject');
const asMatcher = require('../utils/asMatcher');
const defined = require('./IsDefined').defined;
const promiseAgnostic = require('./promiseAgnostic');

function IsObjectWithProperties(properties) {
	const propertyMatchers = _.mapValues(properties, asMatcher);
	return _.create(new IsObject(), {
		matchesSafely: function (actual) {
			const results = _.mapValues(propertyMatchers, (matcher, key) => {
				return matcher.matches(actual[key]);
			});

			return promiseAgnostic.matchesAggregate(results, _.all);
		},
		describeTo: function (description) {
			description.append('an object with {');

			let first = true;
			_.forEach(propertyMatchers, (matcher, key) => {
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
			const results = _.mapValues(propertyMatchers, (matcher, key) => {
				return matcher.matches(actual[key]);
			});

			let first = true;
			const describeVerbose = this.describeVerbose;
			return promiseAgnostic.describeMismatchAggregate(results, (result, key) => {
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
			}, () => {
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
	const properties = {};
	properties[name] = _.isUndefined(valueOrMatcher) ? defined() : valueOrMatcher;
	return new IsObjectWithProperties(properties);
};

module.exports = IsObjectWithProperties;
