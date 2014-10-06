'use strict';

var _ = require('lodash')
	, IsArray = require('./IsArray')
	, asMatcher = require('./IsEqual').asMatcher
	;

// TODO: Make promise agnostic

function ConsumingMatcher(matchers) {
	return _.create({}, {
		unmatchedMatchers: _.clone(matchers),
		matches: function (actual) {
			var matched = false;
			_.forEach(this.unmatchedMatchers, function (matcher, index) {
				if (matcher.matches(actual)) {
					matched = true;
					this.unmatchedMatchers.splice(index, 1);
					return false;
				}
			}, this);
			return matched;
		}
	});
}

var IsArrayContainingInAnyOrder = function IsArrayContainingInAnyOrder(itemsOrMatchers) {
	var matchers = _.map(itemsOrMatchers, asMatcher);
	return _.create(new IsArray(), {
		matchesSafely: function (actual) {
			if (actual.length !== matchers.length) {
				return false;
			}
			var matcher = new ConsumingMatcher(matchers);
			_.forEach(actual, function (item) {
				if (!matcher.matches(item)) {
					return false;
				}
			});
			return matcher.unmatchedMatchers.length === 0;
		},
		describeTo: function (description) {
			description
				.appendList('[', ', ', ']', matchers)
				.append(' in any order');
		},
		describeMismatchSafely: function (actual, description) {
			var matcher = new ConsumingMatcher(matchers);
			var unmatchedItems = [];
			_.forEach(actual, function (item) {
				if (!matcher.matches(item)) {
					unmatchedItems.push(item);
				}
			});
			if (matcher.unmatchedMatchers.length !== 0) {
				description
					.append('no item in ')
					.appendValue(actual)
					.appendList(' matches: ', ', ', '', matcher.unmatchedMatchers);
			}
			else if (unmatchedItems.length !== 0) {
				description
					.appendList('not matched: ', ', ', ' from ', unmatchedItems)
					.appendValue(actual);
			}
		}
	});
};

IsArrayContainingInAnyOrder.containsInAnyOrder = function () {
	return new IsArrayContainingInAnyOrder(arguments);
};

module.exports = IsArrayContainingInAnyOrder;
