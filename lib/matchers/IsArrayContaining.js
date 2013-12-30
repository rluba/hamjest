'use strict';

var _ = require('lodash-node')
	, IsArray = require('./IsArray')
	, asMatcher = require('./IsEqual').asMatcher
	;

var IsArrayContaining = function IsArrayContaining(itemsOrMatchers) {
	var matchers = _.map(itemsOrMatchers, asMatcher);
	return _.create(new IsArray(), {
		matchesSafely: function (actual) {
			if (actual.length !== matchers.length) {
				return false;
			}
			var matched = true;
			_.forEach(actual, function (item, index) {
				if (!matchers[index].matches(item)) {
					matched = false;
					return false;
				}
			});
			return matched;
		},
		describeTo: function (description) {
			description.appendList('[', ', ', ']', matchers);
		},
		describeMismatchSafely: function (actual, description) {
			var firstMismatch;
			_.forEach(actual, function (item, index) {
				if (matchers.length > index && !matchers[index].matches(item)) {
					firstMismatch = index;
					return false;
				}
			});
			if (!_.isUndefined(firstMismatch)) {
				description
					.append('item ')
					.append(firstMismatch)
					.append(': ');
				matchers[firstMismatch].describeMismatch(actual[firstMismatch], description);
				return;
			}

			if (actual.length > matchers.length) {
				description
					.appendList('not matched: ', ', ', '', actual.slice(matchers.length));
			}
			else if (actual.length < matchers.length) {
				description
					.appendList('missing: ', ', ', '', matchers.slice(actual.length));
			}
		}
	});
};

IsArrayContaining.contains = function () {
	return new IsArrayContaining(arguments);
};

module.exports = IsArrayContaining;
