'use strict';

var asserts = {
	assertTrue: function (value, message) {
		if (!value) {
			throw new Error(message);
		}
	},
	assertFalse: function (value, message) {
		if (value) {
			throw new Error(message);
		}
	},
};

module.exports = asserts;
