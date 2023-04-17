'use strict';

const _extend = require('lodash/extend');
const hasSize = require('./hasSize');

module.exports = function () {
	return _extend(hasSize(0), {
		describeTo: function (description) {
			description.append('an empty collection or string');
		}
	});
};
