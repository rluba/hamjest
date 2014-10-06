'use strict';

var _ = require('lodash');
var q = require('q');
var Matcher = require('./Matcher');

function AnyOf(matchers) {
	return _.create(new Matcher(), {
		matches: function (actual) {
			var results = _.map(matchers, function (matcher) {
				return matcher.matches(actual);
			});

			if (_.any(results, q.isPromiseAlike)) {
				return q.all(results).then(function (results) {
					return _.any(results);
				});
			} else {
				return _.any(results);
			}
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
