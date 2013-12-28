'use strict';

var _ = require('lodash-node')
	, Matcher = require('./Matcher')
	;

var IsAnything = function () {
	Matcher.call(this, {
		matches: function () {
			return true;
		},
		describeTo: function (description) {
			description.append('anything');
		}
	});
};
IsAnything.prototype = _.create(Matcher.prototype, { 'constructor': IsAnything });

module.exports = {
	IsAnything: IsAnything,
	anything: function () {
		return new IsAnything();
	}
};
