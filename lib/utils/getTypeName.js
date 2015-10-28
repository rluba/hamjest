'use strict';

module.exports = function getName(type) {
	if (!type.name) {
		return 'ANONYMOUS FUNCTION';
	}

	return type.name;
};
