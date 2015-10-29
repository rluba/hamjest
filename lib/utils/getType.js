'use strict';

var getTypeName = require('./getTypeName');

module.exports = function (value) {
	if (!value.constructor) {
		return '<no type>';
	}
	return getTypeName(value.constructor);
};
