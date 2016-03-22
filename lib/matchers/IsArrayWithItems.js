'use strict';

const _ = require('lodash');
const IsArray = require('./IsArray');
const hasItem = require('./IsArrayWithItem').hasItem;
const AllOf = require('./AllOf');
const asMatcher = require('../utils/asMatcher');

const IsArrayWithItems = function IsArrayWithItems(items) {
	const innerMatcher = new AllOf(_.map(items, hasItem));
	return _.create(new IsArray(), {
		matchesSafely: function (actual) {
			return innerMatcher.matches(actual);
		},
		describeTo: function (description) {
			description
				.append('an array containing ');
			let first = true;
			_.forEach(items, (item) => {
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
