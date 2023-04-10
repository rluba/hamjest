'use strict';

const _create = require('lodash/create');
const _map = require('lodash/map');
const _some = require('lodash/some');
const Matcher = require('./Matcher');
const promiseAgnostic = require('./promiseAgnostic');
const asMatcher = require('../utils/asMatcher');

function AnyOf(matchers) {
	return _create(new Matcher(), {
		matches: function (actual) {
			const results = _map(matchers, (matcher) => {
				return asMatcher(matcher).matches(actual);
			});

			return promiseAgnostic.matchesAggregate(results, _some);
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
