'use strict';

const getTypeName = require('./getTypeName');

module.exports = function (value) {
	if (!value.constructor) {
		return '<no type>';
	}
	return getTypeName(value.constructor);
};
