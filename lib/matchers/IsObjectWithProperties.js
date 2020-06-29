'use strict';

const _ = require('lodash');
const contains = require('./IsArrayContaining').contains;
const IsObject = require('./IsObject');
const isMatcher = require('./Matcher').isMatcher;
const asMatcher = require('../utils/asMatcher');
const defined = require('./IsDefined').defined;
const promiseAgnostic = require('./promiseAgnostic');

function asDeepMatcher(value) {
	if (value && !isMatcher(value)) {
		if (value.constructor === Object || Object.getPrototypeOf(value) === null) {
			return new IsObjectWithProperties(value, true);
		}
		if (_.isArray(value)) {
			return contains(..._.map(value, v => asDeepMatcher(v)));
		}
	}
	return asMatcher(value);
}

function IsObjectWithProperties(properties, deep = false) {
	const propertyMatchers = _.mapValues(properties, deep ? asDeepMatcher : asMatcher);
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
IsObjectWithProperties.hasDeepProperties = function (properties) {
	return new IsObjectWithProperties(properties, true);
};

IsObjectWithProperties.hasProperty = function (propertyOrPath, valueOrMatcher) {
	const propertyPath = _.isArray(propertyOrPath) ? propertyOrPath : propertyOrPath.split('.');
	const propertyToNestedMatcher = (matcher, prop) => new IsObjectWithProperties({[prop]: matcher});
	const initialMatcher = _.isUndefined(valueOrMatcher) ? defined() : valueOrMatcher;
	return _.reduceRight(propertyPath, propertyToNestedMatcher, initialMatcher);
};

module.exports = IsObjectWithProperties;
