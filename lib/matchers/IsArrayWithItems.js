'use strict';

var _ = require('lodash')
	, IsArray = require('./IsArray')
	, hasItem = require('./IsArrayWithItem').hasItem
	, AllOf = require('./AllOf')
	, asMatcher = require('./IsEqual').asMatcher
	;

var IsArrayWithItems = function IsArrayWithItems(items) {
	var innerMatcher = new AllOf(_.map(items, hasItem));
	return _.create(new IsArray(), {
		matchesSafely: function (actual) {
			return innerMatcher.matches(actual);
		},
		describeTo: function (description) {
			description
				.append('an array containing ');
			var first = true;
			_.forEach(items, function (item) {
				if (!first) {
					description.append(', ');
				}
				first = false;
				asMatcher(item).describeTo(description);
			});
		},
		describeMismatchSafely: function (actual, description) {
			if (actual.length === 0) {
				description.append('was empty');
				return;
			}

			innerMatcher.describeMismatch(actual, description);
		}
	});
};

IsArrayWithItems.hasItems = function () {
	return new IsArrayWithItems(arguments);
};

module.exports = IsArrayWithItems;
