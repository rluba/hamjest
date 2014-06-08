'use strict';

var _ = require('lodash')
	, IsArray = require('./IsArray')
	;

function IsArrayOrderedBy(comp, compDescription) {
	compDescription = compDescription || comp.name;
	return _.create(new IsArray(), {
		matchesSafely: function (actual) {
			var correctOrder = true;
			_.reduce(actual, function (previous, element) {
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
			var correctOrder = true;
			var firstMismatch;
			_.reduce(actual, function (previous, element, index) {
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


IsArrayOrderedBy.orderedBy = function (comp, compDescription) {
	return new IsArrayOrderedBy(comp, compDescription);
};

module.exports = IsArrayOrderedBy;
