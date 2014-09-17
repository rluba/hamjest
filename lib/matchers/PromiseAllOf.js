'use strict';

var _ = require('lodash')
	, AllOf = require('./AllOf')
	, q = require('q')
	;

function PromiseAllOf(matchers) {
	return _.create(new AllOf(matchers), {
		matches: function (actual) {
			return q.all(
				_.map(matchers, function (matcher) {
					return matcher.matches(actual);
				})
			).then(function (results) {
				return _.all(results);
			});
		},
		describeMismatch: function (actual, description) {
			var failing = [];
			return q.all(
				_.map(matchers, function (matcher) {
					return q(matcher.matches(actual)).then(function(matches) {
						if (!matches) {
							failing.push(matcher);
						}
					});
				})
			).then(function () {
				if (failing.length) {
					description
						.appendDescriptionOf(failing[0])
						.append(': ');
					return failing[0].describeMismatch(actual, description);
				}
			});
		}
	});
}

PromiseAllOf.promiseAllOf = function () {
	return new PromiseAllOf(arguments);
};

module.exports = PromiseAllOf;
