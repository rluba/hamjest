'use strict';

const _ = require('lodash');
const Matcher = require('./Matcher');
const promiseAgnostic = require('./promiseAgnostic');
const asMatcher = require('../utils/asMatcher');

function AnyOf(matchers) {
	return _.create(new Matcher(), {
		matches: function (actual) {
			const results = _.map(matchers, (matcher) => {
				return asMatcher(matcher).matches(actual);
			});

			return promiseAgnostic.matchesAggregate(results, _.some);
		},
		describeTo: function (description) {
			description.appendList('(', ' or ', ')', matchers);
		}
	});
}

AnyOf.anyOf = function () {
	return new AnyOf(arguments);
};

module.exports = AnyOf;
