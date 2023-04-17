'use strict';

const _create = require('lodash/create');
const _reduce = require('lodash/reduce');
const IsArray = require('./IsArray');

function IsArrayOrderedBy(comp, compDescription) {
	compDescription = compDescription || comp.name;
	return _create(new IsArray(), {
		matchesSafely: function (actual) {
			let correctOrder = true;
			_reduce(actual, (previous, element) => {
				if (!comp(previous, element)) {
					correctOrder = false;
				}
				return element;
			});
			return correctOrder;
		},
		describeTo: function (description) {
			description
				.append('an array ordered ')
				.append(compDescription);
		},
		describeMismatchSafely: function (actual, description) {
			let correctOrder = true;
			let firstMismatch;
			_reduce(actual, (previous, element, index) => {
				if (!comp(previous, element) && correctOrder) {
					correctOrder = false;
					firstMismatch = {
						a: previous,
						aIndex: index - 1,
						b: element,
						bIndex: index
					};
				}
				return element;
			});
			description
				.appendValue(firstMismatch.a).append(' at index ').append(firstMismatch.aIndex)
				.append(' and ')
				.appendValue(firstMismatch.b).append(' at index ').append(firstMismatch.bIndex)
				.append(' are not in order');
		}
	});
}

IsArrayOrderedBy.orderedBy = function (comp, orderName) {
	return new IsArrayOrderedBy(comp, orderName);
};

module.exports = IsArrayOrderedBy;
