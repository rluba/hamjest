'use strict';

var _ = require('lodash-node')
	;

var Matcher = function (params) {
	_.extend(this, params);
};

_.extend(Matcher.prototype, {
	matches: function () {
		throw new Error('Not implemented');
	},
	describeTo: function () {
		throw new Error('Not implemented');
	},
	describeMismatch: function (value, description) {
		description.append('was ').appendValue(value);
	}
});

module.exports = Matcher;
