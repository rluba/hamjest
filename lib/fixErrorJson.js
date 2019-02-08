'use strict';

module.exports = function () {
	if (!Error.prototype.toJSON) {
		Object.defineProperty(Error.prototype, 'toJSON', {
			value: function () {
				const alt = {};

				Object.getOwnPropertyNames(this).forEach(function (key) {
					alt[key] = this[key];
				}, this);

				return alt;
			},
			configurable: true,
			writable: true,
		});
	}
};
