'use strict';

const _ = require('lodash');
const Matcher = require('./Matcher');

const promiseAgnostic = require('./promiseAgnostic');

function AnyOf(matchers) {
	const __ = require('../..');

	return _.create(new Matcher(), {
		matches: function (actual) {
			const results = _.map(matchers, (matcher) => {
				return __.asMatcher(matcher).matches(actual);
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
