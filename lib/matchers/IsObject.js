'use strict';

const _create = require('lodash/create');
const _isObject = require('lodash/isObject');
const TypeSafeMatcher = require('./TypeSafeMatcher');

function IsObject() {
	return _create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _isObject(actual);
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
