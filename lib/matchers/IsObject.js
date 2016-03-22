'use strict';

const _ = require('lodash');
const TypeSafeMatcher = require('./TypeSafeMatcher');

function IsObject() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isObject(actual);
		},
		describeTo: function (description) {
			description
				.append('an object');
		}
	});
}

IsObject.object = function () {
	return new IsObject();
};

module.exports = IsObject;
