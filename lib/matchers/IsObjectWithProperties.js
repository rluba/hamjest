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

			return promiseAgnostic.matchesAggregate(results, _.every);
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
					description.append(',\n');
				}
				first = false;

				description
					.append(key)
					.append(' ');
				return description.indented(() => propertyMatchers[key].describeMismatch(actual[key], description));
			}, () => {
				if (describeVerbose) {
					description.append('\nfor ')
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

IsObjectWithProperties.hasProperty = function (propertyOrPath, valueOrMatcher) {
	const propertyPath = _.isArray(propertyOrPath) ? propertyOrPath : propertyOrPath.split('.');
	const propertyToNestedMatcher = (matcher, prop) => new IsObjectWithProperties({[prop]: matcher});
	const initialMatcher = _.isUndefined(valueOrMatcher) ? defined() : valueOrMatcher;
	return _.reduceRight(propertyPath, propertyToNestedMatcher, initialMatcher);
};

module.exports = IsObjectWithProperties;
