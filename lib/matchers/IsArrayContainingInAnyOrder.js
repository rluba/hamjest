'use strict';

const _ = require('lodash');
const IsArray = require('./IsArray');
const asMatcher = require('../utils/asMatcher');

// TODO: Make promise agnostic

function ConsumingMatcher(matchers) {
	return _.create({}, {
		unmatchedMatchers: _.clone(matchers),
		matches: function (actual) {
			let matched = false;
			_.forEach(this.unmatchedMatchers, (matcher, index) => {
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

const IsArrayContainingInAnyOrder = function IsArrayContainingInAnyOrder(itemsOrMatchers) {
	const matchers = _.map(itemsOrMatchers, asMatcher);
	return _.create(new IsArray(), {
		matchesSafely: function (actual) {
			if (actual.length !== matchers.length) {
				return false;
			}
			const matcher = new ConsumingMatcher(matchers);
			_.forEach(actual, (item) => {
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
			const matcher = new ConsumingMatcher(matchers);
			const unmatchedItems = [];
			_.forEach(actual, (item) => {
				if (!matcher.matches(item)) {
					unmatchedItems.push(item);
				}
			});
			if (matcher.unmatchedMatchers.length !== 0) {
				description
					.append('no item in ')
					.appendValue(actual, true)
					.indented(() => description.appendList(' matches:\n', ',\n', '', matcher.unmatchedMatchers));
			} else if (unmatchedItems.length !== 0) {
				description
					.indented(() => description.appendList('not matched:\n', ',\n', '', unmatchedItems))
					.append('\nfrom ')
					.appendValue(actual, true);
			}
		}
	});
};

IsArrayContainingInAnyOrder.containsInAnyOrder = function () {
	return new IsArrayContainingInAnyOrder(arguments);
};

module.exports = IsArrayContainingInAnyOrder;
