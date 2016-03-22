'use strict';

const _ = require('lodash');
const hasSize = require('./hasSize');

module.exports = function () {
	return _.extend(hasSize(0), {
		describeTo: function (description) {
			description.append('an empty collection or string');
		}
	});
};
