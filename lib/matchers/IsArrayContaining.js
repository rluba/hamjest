'use strict';

var _ = require('lodash')
	, IsArray = require('./IsArray')
	, asMatcher = require('./IsEqual').asMatcher
	;

var promiseAgnostic = require('./promiseAgnostic');

function IsArrayContaining(itemsOrMatchers) {
	var matchers = _.map(itemsOrMatchers, asMatcher);
	return _.create(new IsArray(), {
		matchesSafely: function (actual) {
			if (actual.length !== matchers.length) {
				return false;
			}

			var results = _.map(matchers, function (matcher, index) {
				return matcher.matches(actual[index]);
			});

			return promiseAgnostic.matchesAggregate(results, _.all);
		},
		describeTo: function (description) {
			description.appendList('[', ', ', ']', matchers);
		},
		describeMismatchSafely: function (actual, description) {
			var results = _.map(actual, function (value, index) {
				if (matchers.length > index) {
					return matchers[index].matches(value);
				}
			});

			var first = true;
			return promiseAgnostic.describeMismatchAggregate(results, function (result, index) {
				if (result || matchers.length <= index || actual.length <= index) {
					return;
				}

				if (!first) {
					description.append('\n');
				}
				first = false;

				description
					.append('item ')
					.append(index)
					.append(': ');
				return matchers[index].describeMismatch(actual[index], description);
			}, function () {
				if (!first) {
					description.append('\n');
				}

				if (actual.length > matchers.length) {
					description
						.appendList('not matched: ', ', ', '', actual.slice(matchers.length));
				}
				else if (actual.length < matchers.length) {
					description
						.appendList('missing: ', ', ', '', matchers.slice(actual.length));
				}
			});
		}
	});
}

IsArrayContaining.contains = function () {
	return new IsArrayContaining(arguments);
};

module.exports = IsArrayContaining;
