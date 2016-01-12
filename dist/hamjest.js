(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = require('./lib/hamjest');

},{"./lib/hamjest":6}],2:[function(require,module,exports){
'use strict';

var _ = (window._)
	;

function asSelfDescribing(value) {
	if (_.isUndefined(value) || _.isUndefined(value.describeTo)) {
		return {
			describeTo: function (description) {
				description.appendValue(value);
			}
		};
	}
	else {
		return value;
	}
}

function escapeSpecialCharacters(value) {
	return value.replace(/\n/g, '\\n')
		.replace(/\r/g, '\\r')
		.replace(/\t/g, '\\t')
		.replace(/"/g, '\\"');
}

function Description() {
	var value = '';
	return _.create({}, {
		useJsonForObjects: true,
		append: function (text) {
			value += text;
			return this;
		},
		appendDescriptionOf: function (selfDescribing) {
			if (selfDescribing && _.isFunction(selfDescribing.describeTo)) {
				selfDescribing.describeTo(this);
			}
			else {
				this.appendValue(selfDescribing);
			}
			return this;
		},
		appendValue: function (value) {
			if (_.isUndefined(value)) {
				this.append('undefined');
			} else if (_.isNull(value)) {
				this.append('null');
			} else if (_.isString(value)) {
				this.append('"');
				this.append(escapeSpecialCharacters(value));
				this.append('"');
			} else if (_.isNumber(value)) {
				this.append('<');
				this.append(value);
				this.append('>');
			} else if (_.isArray(value)) {
				this.appendList('[', ', ', ']', value);
			} else if (_.isFunction(value)) {
				this.append('Function' + (value.name  ? ' ' + value.name : ''));
			} else if (_.isRegExp(value)) {
				this.append(value.toString());
			} else if(this.useJsonForObjects) {
				try {
					this.append(JSON.stringify(value));
				}
				catch (e) {
					var oldJsonFlag = this.useJsonForObjects;
					this.useJsonForObjects = false;
					this.appendNonJson(value);
					this.useJsonForObjects = oldJsonFlag;
				}
			} else {
				this.append(value);
			}
			return this;
		},
		appendNonJson: function (value) {
			this.append('{');
			var first = true;
			_.forEach(value, function (innerValue, key) {
				if (!first) {
					this.append(', ');
				}
				first = false;
				this.append(key)
					.append(': ');
				this.appendValue(innerValue);
			}, this);
			this.append('}');
		},
		appendList: function(start, separator, end, list) {
			this.append(start);
			_.forEach(list, function (value, index) {
				if (index !== 0) {
					this.append(separator);
				}
				this.appendDescriptionOf(asSelfDescribing(value));
			}, this);
			this.append(end);
			return this;
		},
		get: function () {
			return value;
		}
	});
}

module.exports = Description;

},{}],3:[function(require,module,exports){
'use strict';

var q = (window.Q);
var _ = (window._);
var AssertionError = require('assertion-error')
	, Description = require('./Description')
	;

function assertThat(reason, actual, matcher) {
	if (arguments.length === 2) {
		matcher = actual;
		actual = reason;
		reason = '';
	}

	var matches = matcher.matches(actual);

	if (q.isPromiseAlike(matches)) {
		throw new AssertionError('Matcher returned a promise instead of a boolean - use promiseThat for promising matchers!', {}, assertThat);
	}

	if (!matches) {
		var description = new Description();
		description.append(reason)
			.append('\nExpected: ')
			.appendDescriptionOf(matcher)
			.append('\n     but: ');
		matcher.describeMismatch(actual, description);

		var errorProperties = {};
		if (_.isFunction(matcher.getExpectedForDiff) &&
			_.isFunction(matcher.formatActualForDiff)) {
			errorProperties = {
				showDiff: true,
				expected: matcher.getExpectedForDiff(),
				actual: matcher.formatActualForDiff(actual)
			};
		}

		throw new AssertionError(description.get(), errorProperties, assertThat);
	}
}

module.exports = assertThat;

},{"./Description":2,"assertion-error":56}],4:[function(require,module,exports){
'use strict';

var AssertionError = require('assertion-error')
	;

function fail(reason) {
	throw new AssertionError(reason, {}, fail);
}

module.exports = fail;

},{"assertion-error":56}],5:[function(require,module,exports){
'use strict';

module.exports = function () {
	if (!Error.prototype.toJSON) {
		Object.defineProperty(Error.prototype, 'toJSON', {
		    value: function () {
		        var alt = {};

		        Object.getOwnPropertyNames(this).forEach(function (key) {
		            alt[key] = this[key];
		        }, this);

		        return alt;
		    },
		    configurable: true
		});
	}
};

},{}],6:[function(require,module,exports){
'use strict';

var _ = (window._)
	, IsEqual = require('./matchers/IsEqual')
	, Matcher = require('./matchers/Matcher')
	, SubstringMatcher = require('./matchers/SubstringMatcher')
	, NumberComparisonMatcher = require('./matchers/NumberComparisonMatcher')
	, DateComparisonMatcher = require('./matchers/DateComparisonMatcher')
	, Description = require('./Description')
	;

require('./fixErrorJson')();

var asserts = {
	assertThat: require('./assertThat'),
	promiseThat: require('./promiseThat'),
	fail: require('./fail')
};

var matchers = {
	Matcher: Matcher,
	TypeSafeMatcher: require('./matchers/TypeSafeMatcher'),
	FeatureMatcher: require('./matchers/FeatureMatcher'),

	anything: require('./matchers/IsAnything').anything,
	strictlyEqualTo: require('./matchers/IsSame').strictlyEqualTo,
	is: require('./matchers/Is').is,
	not: require('./matchers/IsNot').not,
	equalTo: IsEqual.equalTo,
	truthy: require('./matchers/truthy'),
	falsy: require('./matchers/falsy'),
	falsey: require('./matchers/falsy'),
	defined: require('./matchers/IsDefined').defined,
	undefined: require('./matchers/IsDefined').undefined,
	undef: require('./matchers/IsDefined').undefined,
	instanceOf: require('./matchers/IsInstanceOf').instanceOf,
	array: require('./matchers/IsArray').array,
	bool: require('./matchers/IsBoolean').bool,
	date: require('./matchers/IsDate').date,
	func: require('./matchers/IsFunction').func,
	number: require('./matchers/IsNumber').number,
	object: require('./matchers/IsObject').object,
	regExp: require('./matchers/IsRegExp').regExp,
	string: require('./matchers/IsString').string,
	containsString: SubstringMatcher.containsString,
	startsWith: SubstringMatcher.startsWith,
	endsWith: SubstringMatcher.endsWith,
	matchesPattern: require('./matchers/IsStringMatching').matchesPattern,
	matches: require('./matchers/matches'),
	failsToMatch: require('./matchers/failsToMatch'),
	hasDescription: require('./matchers/hasDescription'),
	lessThan: NumberComparisonMatcher.lessThan,
	lessThanOrEqualTo: NumberComparisonMatcher.lessThanOrEqualTo,
	greaterThan: NumberComparisonMatcher.greaterThan,
	greaterThanOrEqualTo: NumberComparisonMatcher.greaterThanOrEqualTo,
	after: DateComparisonMatcher.after,
	afterOrEqualTo: DateComparisonMatcher.afterOrEqualTo,
	before: DateComparisonMatcher.before,
	beforeOrEqualTo: DateComparisonMatcher.beforeOrEqualTo,
	closeTo: require('./matchers/IsCloseTo').closeTo,
	allOf: require('./matchers/AllOf').allOf,
	anyOf: require('./matchers/AnyOf').anyOf,
	everyItem: require('./matchers/Every').everyItem,
	hasItem: require('./matchers/IsArrayWithItem').hasItem,
	hasItems: require('./matchers/IsArrayWithItems').hasItems,
	contains: require('./matchers/IsArrayContaining').contains,
	containsInAnyOrder: require('./matchers/IsArrayContainingInAnyOrder').containsInAnyOrder,
	orderedBy: require('./matchers/IsArrayOrderedBy').orderedBy,
	hasSize: require('./matchers/hasSize'),
	isEmpty: require('./matchers/isEmpty'),
	hasProperties: require('./matchers/IsObjectWithProperties').hasProperties,
	hasProperty: require('./matchers/IsObjectWithProperties').hasProperty,
	throws: require('./matchers/IsFunctionThrowing').throws,
	returns: require('./matchers/returns'),
	typedError: require('./matchers/typedError'),
	promise: require('./matchers/IsPromise').promise,
	fulfilled: require('./matchers/IsFulfilled').fulfilled,
	isFulfilledWith: require('./matchers/IsFulfilled').isFulfilledWith,
	willBe: require('./matchers/IsFulfilled').isFulfilledWith,
	rejected: require('./matchers/IsRejected').rejected,
	isRejectedWith: require('./matchers/IsRejected').isRejectedWith,
	promiseAllOf: require('./matchers/AllOf').allOf
};

var utils = {
	isMatcher: Matcher.isMatcher,
	asMatcher: IsEqual.asMatcher,
	acceptingMatcher: IsEqual.acceptingMatcher,
	Description: Description,
	describe: function (matcher) {
		return new Description()
			.appendDescriptionOf(matcher)
			.get();
	}
};

var hamjest = {};
_.extend(hamjest, asserts, matchers, utils);

module.exports = hamjest;

},{"./Description":2,"./assertThat":3,"./fail":4,"./fixErrorJson":5,"./matchers/AllOf":7,"./matchers/AnyOf":8,"./matchers/DateComparisonMatcher":9,"./matchers/Every":10,"./matchers/FeatureMatcher":11,"./matchers/Is":12,"./matchers/IsAnything":13,"./matchers/IsArray":14,"./matchers/IsArrayContaining":15,"./matchers/IsArrayContainingInAnyOrder":16,"./matchers/IsArrayOrderedBy":17,"./matchers/IsArrayWithItem":18,"./matchers/IsArrayWithItems":19,"./matchers/IsBoolean":20,"./matchers/IsCloseTo":21,"./matchers/IsDate":22,"./matchers/IsDefined":23,"./matchers/IsEqual":24,"./matchers/IsFulfilled":25,"./matchers/IsFunction":26,"./matchers/IsFunctionThrowing":27,"./matchers/IsInstanceOf":28,"./matchers/IsNot":29,"./matchers/IsNumber":30,"./matchers/IsObject":31,"./matchers/IsObjectWithProperties":32,"./matchers/IsPromise":33,"./matchers/IsRegExp":34,"./matchers/IsRejected":35,"./matchers/IsSame":36,"./matchers/IsString":37,"./matchers/IsStringMatching":38,"./matchers/Matcher":39,"./matchers/NumberComparisonMatcher":40,"./matchers/SubstringMatcher":41,"./matchers/TypeSafeMatcher":42,"./matchers/failsToMatch":43,"./matchers/falsy":44,"./matchers/hasDescription":45,"./matchers/hasSize":46,"./matchers/isEmpty":47,"./matchers/matches":48,"./matchers/returns":50,"./matchers/truthy":51,"./matchers/typedError":52,"./promiseThat":53}],7:[function(require,module,exports){
'use strict';

var _ = (window._);
var Matcher = require('./Matcher');
var promiseAgnostic = require('./promiseAgnostic');

function AllOf(matchers) {
	return _.create(new Matcher(), {
		matches: function (actual) {
			var results = _.map(matchers, function (matcher) {
				return matcher.matches(actual);
			});

			return promiseAgnostic.matchesAggregate(results, _.all);
		},
		describeTo: function (description) {
			description.appendList('(', ' and ', ')', matchers);
		},
		describeMismatch: function (actual, description) {
			var results = _.mapValues(matchers, function (matcher) {
				return matcher.matches(actual);
			});
			var first = true;
			return promiseAgnostic.describeMismatchAggregate(results, function (result, key) {
				if (result) {
					return;
				}

				var matcher = matchers[key];

				if (!first) {
					description.append('\n');
				}
				first = false;
				description
					.appendDescriptionOf(matcher)
					.append(': ');
				return matcher.describeMismatch(actual, description);
			});
		}
	});
}

AllOf.allOf = function () {
	return new AllOf(arguments);
};

module.exports = AllOf;

},{"./Matcher":39,"./promiseAgnostic":49}],8:[function(require,module,exports){
'use strict';

var _ = (window._);
var Matcher = require('./Matcher');

var promiseAgnostic = require('./promiseAgnostic');

function AnyOf(matchers) {
	return _.create(new Matcher(), {
		matches: function (actual) {
			var results = _.map(matchers, function (matcher) {
				return matcher.matches(actual);
			});

			return promiseAgnostic.matchesAggregate(results, _.any);
		},
		describeTo: function (description) {
			description.appendList('(', ' or ', ')', matchers);
		}
	});
}

AnyOf.anyOf = function () {
	return new AnyOf(arguments);
};

module.exports = AnyOf;

},{"./Matcher":39,"./promiseAgnostic":49}],9:[function(require,module,exports){
'use strict';

var _ = (window._)
	, IsDate = require('./IsDate')
	, assertThat = require('../assertThat')
	, is = require('./Is').is
	, date = require('./IsDate').date
	;

function DateComparisonMatcher(threshold, relation, matchesNumber) {
	assertThat(threshold, is(date()));

	return _.create(new IsDate(), {
		matchesSafely: function (actual) {
			return matchesNumber.call(this, actual);
		},
		describeTo: function (description) {
			description
				.append('a date ')
				.append(relation)
				.append(' ')
				.appendValue(threshold);
		},
		describeMismatchSafely: function (actual, description) {
			description
				.append('was ')
				.appendValue(actual);
		}
	});
}

_.extend(DateComparisonMatcher, {
	after: function (threshold) {
		return new DateComparisonMatcher(threshold, 'after', function (actual) {
			return actual > threshold;
		});
	},
	afterOrEqualTo: function (threshold) {
		return new DateComparisonMatcher(threshold, 'after or equal to', function (actual) {
			return actual >= threshold;
		});
	},
	before: function (threshold) {
		return new DateComparisonMatcher(threshold, 'before', function (actual) {
			return actual < threshold;
		});
	},
	beforeOrEqualTo: function (threshold) {
		return new DateComparisonMatcher(threshold, 'before or equal to', function (actual) {
			return actual <= threshold;
		});
	}
});

module.exports = DateComparisonMatcher;

},{"../assertThat":3,"./Is":12,"./IsDate":22}],10:[function(require,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = require('./TypeSafeMatcher')
	, acceptingMatcher = require('./IsEqual').acceptingMatcher
	;
var promiseAgnostic = require('./promiseAgnostic');

var Every = acceptingMatcher(function Every(matcher) {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isArray(actual) || _.isObject(actual);
		},
		matchesSafely: function (actual) {
			var results = _.map(actual, function (value) {
				return matcher.matches(value);
			});

			return promiseAgnostic.matchesAggregate(results, _.all);
		},
		describeTo: function (description) {
			description
				.append('every item is ')
				.appendDescriptionOf(matcher);
		},
		describeMismatchSafely: function (actual, description) {
			var results;
			if (_.isArray(actual)) {
				results  = _.map(actual, function (value) {
					return matcher.matches(value);
				});
			} else {
				results  = _.mapValues(actual, function (value) {
					return matcher.matches(value);
				});
			}

			var first = true;
			return promiseAgnostic.describeMismatchAggregate(results, function (result, key) {
				if (result) {
					return;
				}

				if (!first) {
					description.append(', ');
				}
				first = false;
				description.append('item ').appendValue(key).append(' ');
				matcher.describeMismatch(actual[key], description);
			});
		}
	});
});

Every.everyItem = function (matcherOrValue) {
	return new Every(matcherOrValue);
};

module.exports = Every;

},{"./IsEqual":24,"./TypeSafeMatcher":42,"./promiseAgnostic":49}],11:[function(require,module,exports){
'use strict';

var _ = (window._)
	, Matcher = require('./Matcher')
	, asMatcher = require('./IsEqual').asMatcher
	;

var promiseAgnostic = require('./promiseAgnostic');

function FeatureMatcher(valueOrMatcher, featureDescription, featureName, featureFunction) {
	var matcher = asMatcher(valueOrMatcher);
	featureFunction = featureFunction || function (item) {
		return item[featureName];
	};

	return _.create(new Matcher(), {
		matches: function (actual) {
			var featureValue = featureFunction(actual);
			return matcher.matches(featureValue);
		},
		describeTo: function (description) {
			description
				.append(featureDescription)
				.append(' ')
				.appendDescriptionOf(matcher);
		},
		describeMismatch: function (actual, description) {
			var featureValue = featureFunction(actual);
			return promiseAgnostic.describeMismatch(matcher.matches(featureValue), function () {
				description
					.append(featureName)
					.append(' ');
				return matcher.describeMismatch(featureValue, description);
			}, function () {
				description
					.append('\nfor ')
					.appendValue(actual);
			});
		}
	});
}

module.exports = FeatureMatcher;

},{"./IsEqual":24,"./Matcher":39,"./promiseAgnostic":49}],12:[function(require,module,exports){
'use strict';

var _ = (window._)
	, Matcher = require('./Matcher')
	, acceptingMatcher = require('./IsEqual').acceptingMatcher
	;

var Is = acceptingMatcher(function Is(innerMatcher) {
	return _.create(new Matcher(), {
		matches: function (actualValue) {
			return innerMatcher.matches(actualValue);
		},
		describeTo: function (description) {
			description
				.append('is ')
				.appendDescriptionOf(innerMatcher);
		},
		describeMismatch: function (value, description) {
			return innerMatcher.describeMismatch(value, description);
		},
		getExpectedForDiff: innerMatcher.getExpectedForDiff,
		formatActualForDiff: innerMatcher.formatActualForDiff
	});
});

Is.is = function (innerMatcher) {
	return new Is(innerMatcher);
};

module.exports = Is;

},{"./IsEqual":24,"./Matcher":39}],13:[function(require,module,exports){
'use strict';

var _ = (window._)
	, Matcher = require('./Matcher')
	;

function IsAnything() {
	return _.create(new Matcher(), {
		matches: function () {
			return true;
		},
		describeTo: function (description) {
			description.append('anything');
		}
	});
}

IsAnything.anything = function () {
	return new IsAnything();
};

module.exports = IsAnything;

},{"./Matcher":39}],14:[function(require,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = require('./TypeSafeMatcher')
	;

function IsArray() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isArray(actual);
		},
		describeTo: function (description) {
			description
				.append('an array');
		}
	});
}

IsArray.array = function () {
	return new IsArray();
};

module.exports = IsArray;

},{"./TypeSafeMatcher":42}],15:[function(require,module,exports){
'use strict';

var _ = (window._)
	, IsArray = require('./IsArray')
	, asMatcher = require('./IsEqual').asMatcher
	;

var promiseAgnostic = require('./promiseAgnostic');

function IsArrayContaining(itemsOrMatchers) {
	var matchers = _.map(itemsOrMatchers, asMatcher);
	return _.create(new IsArray(), {
		matchesSafely: function (actual) {
			if (actual.length !== matchers.length) {
				return false;
			}

			var results = _.map(matchers, function (matcher, index) {
				return matcher.matches(actual[index]);
			});

			return promiseAgnostic.matchesAggregate(results, _.all);
		},
		describeTo: function (description) {
			description.appendList('[', ', ', ']', matchers);
		},
		describeMismatchSafely: function (actual, description) {
			var results = _.map(actual, function (value, index) {
				if (matchers.length > index) {
					return matchers[index].matches(value);
				}
			});

			var first = true;
			return promiseAgnostic.describeMismatchAggregate(results, function (result, index) {
				if (result || matchers.length <= index || actual.length <= index) {
					return;
				}

				if (!first) {
					description.append('\n');
				}
				first = false;

				description
					.append('item ')
					.append(index)
					.append(': ');
				return matchers[index].describeMismatch(actual[index], description);
			}, function () {
				if (!first) {
					description.append('\n');
				}

				if (actual.length > matchers.length) {
					description
						.appendList('not matched: ', ', ', '', actual.slice(matchers.length));
				}
				else if (actual.length < matchers.length) {
					description
						.appendList('missing: ', ', ', '', matchers.slice(actual.length));
				}
			});
		}
	});
}

IsArrayContaining.contains = function () {
	return new IsArrayContaining(arguments);
};

module.exports = IsArrayContaining;

},{"./IsArray":14,"./IsEqual":24,"./promiseAgnostic":49}],16:[function(require,module,exports){
'use strict';

var _ = (window._)
	, IsArray = require('./IsArray')
	, asMatcher = require('./IsEqual').asMatcher
	;

// TODO: Make promise agnostic

function ConsumingMatcher(matchers) {
	return _.create({}, {
		unmatchedMatchers: _.clone(matchers),
		matches: function (actual) {
			var matched = false;
			_.forEach(this.unmatchedMatchers, function (matcher, index) {
				if (matcher.matches(actual)) {
					matched = true;
					this.unmatchedMatchers.splice(index, 1);
					return false;
				}
			}, this);
			return matched;
		}
	});
}

var IsArrayContainingInAnyOrder = function IsArrayContainingInAnyOrder(itemsOrMatchers) {
	var matchers = _.map(itemsOrMatchers, asMatcher);
	return _.create(new IsArray(), {
		matchesSafely: function (actual) {
			if (actual.length !== matchers.length) {
				return false;
			}
			var matcher = new ConsumingMatcher(matchers);
			_.forEach(actual, function (item) {
				if (!matcher.matches(item)) {
					return false;
				}
			});
			return matcher.unmatchedMatchers.length === 0;
		},
		describeTo: function (description) {
			description
				.appendList('[', ', ', ']', matchers)
				.append(' in any order');
		},
		describeMismatchSafely: function (actual, description) {
			var matcher = new ConsumingMatcher(matchers);
			var unmatchedItems = [];
			_.forEach(actual, function (item) {
				if (!matcher.matches(item)) {
					unmatchedItems.push(item);
				}
			});
			if (matcher.unmatchedMatchers.length !== 0) {
				description
					.append('no item in ')
					.appendValue(actual)
					.appendList(' matches: ', ', ', '', matcher.unmatchedMatchers);
			}
			else if (unmatchedItems.length !== 0) {
				description
					.appendList('not matched: ', ', ', ' from ', unmatchedItems)
					.appendValue(actual);
			}
		}
	});
};

IsArrayContainingInAnyOrder.containsInAnyOrder = function () {
	return new IsArrayContainingInAnyOrder(arguments);
};

module.exports = IsArrayContainingInAnyOrder;

},{"./IsArray":14,"./IsEqual":24}],17:[function(require,module,exports){
'use strict';

var _ = (window._)
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

},{"./IsArray":14}],18:[function(require,module,exports){
'use strict';

var _ = (window._)
	, IsArray = require('./IsArray')
	, acceptingMatcher = require('./IsEqual').acceptingMatcher
	;
var promiseAgnostic = require('./promiseAgnostic');

var IsArrayWithItem = acceptingMatcher(function IsArrayWithItem(matcher) {
	return _.create(new IsArray(), {
		matchesSafely: function (actual) {
			var results = _.map(actual, function (value) {
				return matcher.matches(value);
			});

			return promiseAgnostic.matchesAggregate(results, _.any);
		},
		describeTo: function (description) {
			description
				.append('an array containing ')
				.appendDescriptionOf(matcher);
		},
		describeMismatchSafely: function (actual, description) {
			if (actual.length === 0) {
				description.append('was empty');
				return;
			}
			var results = _.map(actual, function (value) {
				return matcher.matches(value);
			});

			var first = true;
			description.append('[');
			return promiseAgnostic.describeMismatchAggregate(results, function (result, index) {
				if (!first) {
					description.append(', ');
				}
				first = false;
				return matcher.describeMismatch(actual[index], description);
			}, function () {
				description.append(']');
			});
		}
	});
});

IsArrayWithItem.hasItem = function (matcherOrValue) {
	return new IsArrayWithItem(matcherOrValue);
};

module.exports = IsArrayWithItem;

},{"./IsArray":14,"./IsEqual":24,"./promiseAgnostic":49}],19:[function(require,module,exports){
'use strict';

var _ = (window._)
	, IsArray = require('./IsArray')
	, hasItem = require('./IsArrayWithItem').hasItem
	, AllOf = require('./AllOf')
	, asMatcher = require('./IsEqual').asMatcher
	;

var IsArrayWithItems = function IsArrayWithItems(items) {
	var innerMatcher = new AllOf(_.map(items, hasItem));
	return _.create(new IsArray(), {
		matchesSafely: function (actual) {
			return innerMatcher.matches(actual);
		},
		describeTo: function (description) {
			description
				.append('an array containing ');
			var first = true;
			_.forEach(items, function (item) {
				if (!first) {
					description.append(', ');
				}
				first = false;
				asMatcher(item).describeTo(description);
			});
		},
		describeMismatchSafely: function (actual, description) {
			if (actual.length === 0) {
				description.append('was empty');
				return;
			}

			innerMatcher.describeMismatch(actual, description);
		}
	});
};

IsArrayWithItems.hasItems = function () {
	return new IsArrayWithItems(arguments);
};

module.exports = IsArrayWithItems;

},{"./AllOf":7,"./IsArray":14,"./IsArrayWithItem":18,"./IsEqual":24}],20:[function(require,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = require('./TypeSafeMatcher')
	;

function IsBoolean() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isBoolean(actual);
		},
		describeTo: function (description) {
			description
				.append('a boolean');
		}
	});
}

IsBoolean.bool = function () {
	return new IsBoolean();
};

module.exports = IsBoolean;

},{"./TypeSafeMatcher":42}],21:[function(require,module,exports){
'use strict';

var _ = (window._)
	, IsNumber = require('./IsNumber')
	, assertThat = require('../assertThat')
	, is = require('./Is').is
	, number = require('./IsNumber').number
	;

function IsCloseTo(threshold, delta) {
	assertThat(threshold, is(number()));
	assertThat(delta, is(number()));

	function getDelta(actual) {
		return Math.abs(actual - threshold);
	}

	return _.create(new IsNumber(), {
		matchesSafely: function (actual) {
			return getDelta(actual) <= delta;
		},
		describeTo: function (description) {
			description
				.append('a number within ')
				.appendValue(delta)
				.append(' of ')
				.appendValue(threshold);
		},
		describeMismatchSafely: function (actual, description) {
			description
				.appendValue(actual)
				.append(' differed by ')
				.appendValue(getDelta(actual));
		}
	});
}

IsCloseTo.closeTo = function (threshold, delta) {
	return new IsCloseTo(threshold, delta);
};

module.exports = IsCloseTo;

},{"../assertThat":3,"./Is":12,"./IsNumber":30}],22:[function(require,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = require('./TypeSafeMatcher')
	;

function IsDate() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isDate(actual);
		},
		describeTo: function (description) {
			description
				.append('a date');
		}
	});
}

IsDate.date = function () {
	return new IsDate();
};

module.exports = IsDate;

},{"./TypeSafeMatcher":42}],23:[function(require,module,exports){
'use strict';

var _ = (window._)
	, Matcher = require('./Matcher')
	, not = require('./IsNot').not
	;

function IsDefined() {
	return _.create(new Matcher(), {
		matches: function (actual) {
			return !_.isUndefined(actual);
		},
		describeTo: function (description) {
			description.append('defined');
		}
	});
}

IsDefined.defined = function () {
	return new IsDefined();
};

IsDefined.undefined = function () {
	return not(IsDefined.defined());
};

module.exports = IsDefined;

},{"./IsNot":29,"./Matcher":39}],24:[function(require,module,exports){
'use strict';

var _ = (window._)
	, Matcher = require('./Matcher')
	;

function IsEqual(expectedValue) {
	return _.create(new Matcher(), {
		matches: function (actualValue) {
			return _.isEqual(expectedValue, actualValue);
		},
		describeTo: function (description) {
			description.appendValue(expectedValue);
		},
		getExpectedForDiff: function () { return expectedValue; },
		formatActualForDiff: function (actual) { return actual; }
	});
}

IsEqual.equalTo = function (operand) {
	return new IsEqual(operand);
};

IsEqual.asMatcher = function (valueOrMatcher) {
	if (Matcher.isMatcher(valueOrMatcher)) {
		return valueOrMatcher;
	}
	else {
		return IsEqual.equalTo(valueOrMatcher);
	}
};

IsEqual.acceptingMatcher = function (innerFunction) {
	return function (valueOrMatcher) {
		return innerFunction.call(this, IsEqual.asMatcher(valueOrMatcher));
	};
};

module.exports = IsEqual;

},{"./Matcher":39}],25:[function(require,module,exports){
'use strict';

var _ = (window._)
	, q = (window.Q)
	, IsPromise = require('./IsPromise')
	, asMatcher = require('./IsEqual').asMatcher
	, anything = require('./IsAnything').anything
	;

function IsFulfilled(valueOrMatcher) {
	var anyValue = (arguments.length === 0);
	var valueMatcher = (anyValue ? anything() : asMatcher(valueOrMatcher));
	return _.create(new IsPromise(), {
		matchesSafely: function (actual) {
			return actual.then(function (value) {
				return valueMatcher.matches(value);
			}, function () {
				return false;
			});
		},
		describeTo: function (description) {
			if (anyValue) {
				description.append('a fulfilled promise');
			}
			else {
				description.append('a promise fulfilled with ');
				valueMatcher.describeTo(description);
			}
		},
		describeMismatchSafely: function (actual, description) {
			var deferred = q.defer();

			var qPromise = q(actual);
			qPromise.fin(function () {
				if (!q.isFulfilled(qPromise)) {
					description
						.append('was not fulfilled (')
						.appendValue(qPromise.inspect())
						.append(')');
					deferred.resolve();
				}
				else {
					description
						.append('fulfillment value: ');
					deferred.resolve(valueMatcher.describeMismatch(qPromise.inspect().value, description));
				}
			});
			return deferred.promise;
		}
	});
}

IsFulfilled.fulfilled = function (operand) {
	if (arguments.length === 0) {
		return new IsFulfilled();
	}
	else {
		return new IsFulfilled(operand);
	}
};
IsFulfilled.isFulfilledWith = IsFulfilled.fulfilled;

module.exports = IsFulfilled;

},{"./IsAnything":13,"./IsEqual":24,"./IsPromise":33}],26:[function(require,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = require('./TypeSafeMatcher')
	;

function IsFunction() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isFunction(actual);
		},
		describeTo: function (description) {
			description
				.append('a function');
		}
	});
}

IsFunction.func = function () {
	return new IsFunction();
};

module.exports = IsFunction;

},{"./TypeSafeMatcher":42}],27:[function(require,module,exports){
'use strict';

var _ = (window._)
	, IsFunction = require('./IsFunction')
	, asMatcher = require('./IsEqual').asMatcher
	, anything = require('./IsAnything').anything
	;

function IsFunctionThrowing(valueOrMatcher) {
	var anyValue = (arguments.length === 0);
	var exceptionMatcher = (anyValue ? anything() : asMatcher(valueOrMatcher));
	return _.create(new IsFunction(), {
		matchesSafely: function (throwingFunction) {
			try {
				throwingFunction();
				return false;
			}
			catch(e) {
				return exceptionMatcher.matches(e);
			}
		},
		describeTo: function (description) {
			description.append('a function throwing ');
			exceptionMatcher.describeTo(description);
		},
		describeMismatch: function (throwingFunction, description) {
			try {
				throwingFunction();
				description
					.appendValue(throwingFunction)
					.append(' did not throw anything');
			}
			catch(e) {
				description.append('thrown object: ');
				return exceptionMatcher.describeMismatch(e, description);
			}
		}
	});
}

IsFunctionThrowing.throws = function (operand) {
	if (arguments.length === 0) {
		return new IsFunctionThrowing();
	}
	else {
		return new IsFunctionThrowing(operand);
	}
};

module.exports = IsFunctionThrowing;

},{"./IsAnything":13,"./IsEqual":24,"./IsFunction":26}],28:[function(require,module,exports){
'use strict';

var _ = (window._)
	, Matcher = require('./Matcher')
	, assertThat = require('../assertThat')
	, is = require('./Is').is
	, func = require('./IsFunction').func
	;
var getType = require('../utils/getType');
var getTypeName = require('../utils/getTypeName');

function IsInstanceOf(expectedType) {
	assertThat(expectedType, is(func()));

	return _.create(new Matcher(), {
		matches: function (actual) {
			return actual instanceof expectedType;
		},
		describeTo: function (description) {
			description
				.append('an instance of ')
				.append(getTypeName(expectedType));
		},
		describeMismatch: function (actual, description) {
			if(_.isUndefined(actual)) {
				description
					.append('was ')
					.appendValue(actual);
				return;
			}

			description
				.appendValue(actual)
				.append(' is a ')
				.append(getType(actual));
		}
	});
}

IsInstanceOf.instanceOf = function (operand) {
	return new IsInstanceOf(operand);
};

module.exports = IsInstanceOf;

},{"../assertThat":3,"../utils/getType":54,"../utils/getTypeName":55,"./Is":12,"./IsFunction":26,"./Matcher":39}],29:[function(require,module,exports){
'use strict';

var _ = (window._)
	, Matcher = require('./Matcher')
	, acceptingMatcher = require('./IsEqual').acceptingMatcher
	;
var promiseAgnostic = require('./promiseAgnostic');

var IsNot = acceptingMatcher(function IsNot(innerMatcher) {
	return _.create(new Matcher(), {
		matches: function (actual) {
			return promiseAgnostic.matches(innerMatcher.matches(actual), function (result) {
				return !result;
			});
		},
		describeTo: function (description) {
			description
				.append('not ')
				.appendDescriptionOf(innerMatcher);
		},
		describeMismatch: function (value, description) {
			description
				.append('was ')
				.appendValue(value);
		}
	});
});

IsNot.not = function (innerMatcher) {
	return new IsNot(innerMatcher);
};

module.exports = IsNot;

},{"./IsEqual":24,"./Matcher":39,"./promiseAgnostic":49}],30:[function(require,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = require('./TypeSafeMatcher')
	;

function IsNumber() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isNumber(actual);
		},
		describeTo: function (description) {
			description
				.append('a number');
		}
	});
}

IsNumber.number = function () {
	return new IsNumber();
};

module.exports = IsNumber;

},{"./TypeSafeMatcher":42}],31:[function(require,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = require('./TypeSafeMatcher')
	;

function IsObject() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isObject(actual);
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

},{"./TypeSafeMatcher":42}],32:[function(require,module,exports){
'use strict';

var _ = (window._)
	, IsObject = require('./IsObject')
	, asMatcher = require('./IsEqual').asMatcher
	, defined = require('./IsDefined').defined
	;
var promiseAgnostic = require('./promiseAgnostic');

function IsObjectWithProperties(properties) {
	var propertyMatchers = _.mapValues(properties, asMatcher);
	return _.create(new IsObject(), {
		matchesSafely: function (actual) {
			var results = _.mapValues(propertyMatchers, function (matcher, key) {
				return matcher.matches(actual[key]);
			});

			return promiseAgnostic.matchesAggregate(results, _.all);
		},
		describeTo: function (description) {
			description.append('an object with {');

			var first = true;
			_.forEach(propertyMatchers, function (matcher, key) {
				if (!first) {
					description.append(', ');
				}
				first = false;

				description
					.append(key)
					.append(': ')
					.appendDescriptionOf(matcher);
			});

			description.append('}');
		},
		describeMismatchSafely: function (actual, description) {
			var results = _.mapValues(propertyMatchers, function (matcher, key) {
				return matcher.matches(actual[key]);
			});

			var first = true;
			return promiseAgnostic.describeMismatchAggregate(results, function (result, key) {
				if (result) {
					return;
				}

				if (!first) {
					description.append(', ');
				}
				first = false;

				description
					.append(key)
					.append(' ');
				return propertyMatchers[key].describeMismatch(actual[key], description);
			});
		}
	});
}

IsObjectWithProperties.hasProperties = function (properties) {
	return new IsObjectWithProperties(properties);
};

IsObjectWithProperties.hasProperty = function (name, valueOrMatcher) {
	var properties = {};
	properties[name] = _.isUndefined(valueOrMatcher) ? defined() : valueOrMatcher;
	return new IsObjectWithProperties(properties);
};

module.exports = IsObjectWithProperties;

},{"./IsDefined":23,"./IsEqual":24,"./IsObject":31,"./promiseAgnostic":49}],33:[function(require,module,exports){
'use strict';

var _ = (window._)
	, q = (window.Q)
	, TypeSafeMatcher = require('./TypeSafeMatcher')
	;

function IsPromise() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return q.isPromiseAlike(actual);
		},
		describeTo: function (description) {
			description
				.append('a promise');
		}
	});
}

IsPromise.promise = function () {
	return new IsPromise();
};

module.exports = IsPromise;

},{"./TypeSafeMatcher":42}],34:[function(require,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = require('./TypeSafeMatcher')
	;

function IsRegExp() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isRegExp(actual);
		},
		describeTo: function (description) {
			description
				.append('a regular expression');
		}
	});
}

IsRegExp.regExp = function () {
	return new IsRegExp();
};

module.exports = IsRegExp;

},{"./TypeSafeMatcher":42}],35:[function(require,module,exports){
'use strict';

var _ = (window._)
	, q = (window.Q)
	, IsPromise = require('./IsPromise')
	, asMatcher = require('./IsEqual').asMatcher
	, anything = require('./IsAnything').anything
	;

function IsRejected(valueOrMatcher) {
	var anyValue = (arguments.length === 0);
	var valueMatcher = (anyValue ? anything() : asMatcher(valueOrMatcher));
	return _.create(new IsPromise(), {
		matchesSafely: function (actual) {
			return actual.then(function () {
				return false;
			}, function (reason) {
				return valueMatcher.matches(reason);
			});
		},
		describeTo: function (description) {
			if (anyValue) {
				description.append('a rejected promise');
			}
			else {
				description.append('a promise rejected with ');
				valueMatcher.describeTo(description);
			}
		},
		describeMismatchSafely: function (actual, description) {
			var deferred = q.defer();

			var qPromise = q(actual);
			qPromise.fin(function () {
				if (!q.isRejected(qPromise)) {
					description
						.append('was not rejected (')
						.appendValue(qPromise.inspect())
						.append(')');
				}
				else {
					description
						.append('was rejected with ')
						.appendValue(qPromise.inspect().reason);
				}
				deferred.resolve();
			});
			return deferred.promise;
		}
	});
}

IsRejected.rejected = function (operand) {
	if (arguments.length === 0) {
		return new IsRejected();
	}
	else {
		return new IsRejected(operand);
	}
};
IsRejected.isRejectedWith = IsRejected.rejected;


module.exports = IsRejected;

},{"./IsAnything":13,"./IsEqual":24,"./IsPromise":33}],36:[function(require,module,exports){
'use strict';

var _ = (window._)
	, Matcher = require('./Matcher')
	;

function IsSame(expectedValue) {
	return _.create(new Matcher(), {
		matches: function (actualValue) {
			return expectedValue === actualValue;
		},
		describeTo: function (description) {
			description.append('same instance (').appendValue(expectedValue).append(')');
		}
	});
}

IsSame.strictlyEqualTo = function (operand) {
	return new IsSame(operand);
};

module.exports = IsSame;

},{"./Matcher":39}],37:[function(require,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = require('./TypeSafeMatcher')
	;

function IsString() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isString(actual);
		},
		describeTo: function (description) {
			description
				.append('a string');
		}
	});
}

IsString.string = function () {
	return new IsString();
};

module.exports = IsString;

},{"./TypeSafeMatcher":42}],38:[function(require,module,exports){
'use strict';

var _ = (window._)
	, IsString = require('./IsString')
	, assertThat = require('../assertThat')
	, anyOf = require('./AnyOf').anyOf
	, string = require('./IsString').string
	, regExp = require('./IsRegExp').regExp
	;

function IsStringMatching(stringOrPattern) {
	assertThat(stringOrPattern, anyOf(regExp(), string()));

	var pattern = new RegExp(stringOrPattern);

	return _.create(new IsString(), {
		matchesSafely: function (actual) {
			return pattern.test(actual);
		},
		describeTo: function (description) {
			description
				.append('a string matching ')
				.appendValue(pattern);
		},
		describeMismatchSafely: function (actual, description) {
			description
				.append('was ')
				.appendValue(actual);
		}
	});
}

IsStringMatching.matchesPattern = function (stringOrPattern) {
	return new IsStringMatching(stringOrPattern);
};

module.exports = IsStringMatching;

},{"../assertThat":3,"./AnyOf":8,"./IsRegExp":34,"./IsString":37}],39:[function(require,module,exports){
'use strict';

var _ = (window._)
	;

function Matcher() {
	return _.create({}, {
		matches: function () {
			throw new Error('Not implemented');
		},
		describeTo: function () {
			throw new Error('Not implemented');
		},
		describeMismatch: function (value, description) {
			description.append('was ').appendValue(value);
		}
	});
}

Matcher.isMatcher = function (matcherOrValue) {
	return !_.isUndefined(matcherOrValue) &&
		!_.isNull(matcherOrValue) &&
		_.isFunction(matcherOrValue.matches) &&
		_.isFunction(matcherOrValue.describeTo) &&
		_.isFunction(matcherOrValue.describeMismatch);
};

module.exports = Matcher;

},{}],40:[function(require,module,exports){
'use strict';

var _ = (window._)
	, IsNumber = require('./IsNumber')
	, assertThat = require('../assertThat')
	, is = require('./Is').is
	, number = require('./IsNumber').number
	;

function NumberComparisonMatcher(relation, threshold, matchesNumber) {
	assertThat(threshold, is(number()));

	return _.create(new IsNumber(), {
		matchesSafely: function (actual) {
			return matchesNumber.call(this, actual);
		},
		describeTo: function (description) {
			description
				.append('a number ')
				.append(relation)
				.append(' ')
				.appendValue(threshold);
		},
		describeMismatchSafely: function (actual, description) {
			description
				.append('was ')
				.appendValue(actual);
		}
	});
}

_.extend(NumberComparisonMatcher, {
	greaterThan: function (threshold) {
		return new NumberComparisonMatcher('greater than', threshold, function (actual) {
			return actual > threshold;
		});
	},
	greaterThanOrEqualTo: function (threshold) {
		return new NumberComparisonMatcher('greater than or equal to', threshold, function (actual) {
			return actual >= threshold;
		});
	},
	lessThan: function (threshold) {
		return new NumberComparisonMatcher('less than', threshold, function (actual) {
			return actual < threshold;
		});
	},
	lessThanOrEqualTo: function (threshold) {
		return new NumberComparisonMatcher('less than or equal to', threshold, function (actual) {
			return actual <= threshold;
		});
	}
});

module.exports = NumberComparisonMatcher;

},{"../assertThat":3,"./Is":12,"./IsNumber":30}],41:[function(require,module,exports){
'use strict';

var _ = (window._)
	, IsString = require('./IsString')
	, assertThat = require('../assertThat')
	, is = require('./Is').is
	, string = require('./IsString').string
	;

function SubstringMatcher(substring, relation, matchesString) {
	assertThat(substring, is(string()));

	return _.create(new IsString(), {
		matchesSafely: function (actual) {
			return matchesString.call(this, actual);
		},
		describeTo: function (description) {
			description
				.append('a string ')
				.append(relation)
				.append(' ')
				.appendValue(substring);
		},
		describeMismatchSafely: function (actual, description) {
			description
				.append('was ')
				.appendValue(actual);
		},
		getExpectedForDiff: function () { return substring; },
		formatActualForDiff: function (actual) { return actual; }
	});
}

_.extend(SubstringMatcher, {
	containsString: function (substring) {
		return new SubstringMatcher(substring, 'containing', function (actualString) {
			return actualString.indexOf(substring) !== -1;
		});
	},
	startsWith: function (prefix) {
		return new SubstringMatcher(prefix, 'starting with', function (actualString) {
			return actualString.indexOf(prefix) === 0;
		});
	},
	endsWith: function (suffix) {
		return new SubstringMatcher(suffix, 'ending with', function (actualString) {
			return actualString.indexOf(suffix, actualString.length - suffix.length) !== -1;
		});
	}
});

module.exports = SubstringMatcher;

},{"../assertThat":3,"./Is":12,"./IsString":37}],42:[function(require,module,exports){
'use strict';

var _ = (window._)
	, Matcher = require('./Matcher')
	;
var getType = require('../utils/getType');

function TypeSafeMatcher() {
	return _.create(new Matcher(), {
		matches: function (actual) {
			if (!this.isExpectedType(actual)) {
				return false;
			}
			return this.matchesSafely(actual);
		},
		describeMismatch: function (actual, description) {
			if (!this.isExpectedType(actual)) {
				if (!actual) {
					description.append('was ')
						.appendValue(actual);
					return;
				}

				description
					.append('was a ')
					.append(getType(actual))
					.append(' (')
					.appendValue(actual)
					.append(')');
			}
			else {
				return this.describeMismatchSafely(actual, description);
			}
		},
		isExpectedType: function () {
			throw new Error('Not implemented');
		},
		matchesSafely: function () {
			return true;
		},
		describeMismatchSafely: function () {
			throw new Error('Not implemented');
		}
	});
}

module.exports = TypeSafeMatcher;

},{"../utils/getType":54,"./Matcher":39}],43:[function(require,module,exports){
'use strict';

var _ = (window._);
var Description = require('./../Description');
var TypeSafeMatcher = require('./TypeSafeMatcher');
var anything = require('./IsAnything').anything;
var asMatcher = require('./IsEqual').asMatcher;
var isMatcher = require('./Matcher').isMatcher;

function failsToMatch(target, descriptionMatcher) {
	descriptionMatcher = descriptionMatcher ? asMatcher(descriptionMatcher) : anything();
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return isMatcher(actual);
		},
		matchesSafely: function (actual) {
			if (actual.matches(target)) {
				return false;
			}

			var mismatchDescription = new Description();
			actual.describeMismatch(target, mismatchDescription);
			return descriptionMatcher.matches(mismatchDescription.get());
		},
		describeTo: function (description) {
			description.append('a matcher failing to match ')
				.appendValue(target)
				.append(' with mismatch description "')
				.appendDescriptionOf(descriptionMatcher)
				.append('"');
		},
		describeMismatchSafely: function (actual, description) {
			description
				.append('matcher with description ')
				.appendValue(new Description()
					.appendDescriptionOf(actual)
					.get()
				);

			if (actual.matches(target)) {
				description.append(' matched');
				return;
			}
			else {
				var mismatchDescription = new Description();
				actual.describeMismatch(target, mismatchDescription);

				description.append(': mismatch description ');
				descriptionMatcher.describeMismatch(mismatchDescription.get(), description);
			}
		}
	});
}

module.exports = failsToMatch;

},{"./../Description":2,"./IsAnything":13,"./IsEqual":24,"./Matcher":39,"./TypeSafeMatcher":42}],44:[function(require,module,exports){
'use strict';

var _ = (window._)
	, Matcher = require('./Matcher')
	;

function falsy() {
	return _.create(new Matcher(), {
		matches: function (actualValue) {
			return !actualValue;
		},
		describeTo: function (description) {
			description.append('falsy value');
		}
	});
}

module.exports = falsy;

},{"./Matcher":39}],45:[function(require,module,exports){
'use strict';

var _ = (window._);
var Description = require('./../Description');
var TypeSafeMatcher = require('./TypeSafeMatcher');
var acceptingMatcher = require('./IsEqual').acceptingMatcher;
var isMatcher = require('./Matcher').isMatcher;

module.exports = acceptingMatcher(function hasDescription(descriptionMatcher) {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return isMatcher(actual);
		},
		matchesSafely: function (actual) {
			var actualDescription = new Description()
				.appendDescriptionOf(actual)
				.get();
			return descriptionMatcher.matches(actualDescription);
		},
		describeTo: function (description) {
			description.append('a matcher with description: ')
				.appendDescriptionOf(descriptionMatcher);
		},
		describeMismatchSafely: function (actual, description) {
			description.append('matcher description ');
			var actualDescription = new Description()
				.appendDescriptionOf(actual)
				.get();
			descriptionMatcher.describeMismatch(actualDescription, description);
		}
	});
});

},{"./../Description":2,"./IsEqual":24,"./Matcher":39,"./TypeSafeMatcher":42}],46:[function(require,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = require('./TypeSafeMatcher')
	, FeatureMatcher = require('./FeatureMatcher')
	;

module.exports = function (matcherOrValue) {
	var innerMatcher = new FeatureMatcher(matcherOrValue, 'a collection or string with size', 'size', function (item) {
		return _.size(item);
	});
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isString(actual) || _.isObject(actual);
		},
		matchesSafely: innerMatcher.matches,
		describeTo: innerMatcher.describeTo,
		describeMismatchSafely: innerMatcher.describeMismatch
	});
};

},{"./FeatureMatcher":11,"./TypeSafeMatcher":42}],47:[function(require,module,exports){
'use strict';

var _ = (window._);
var hasSize = require('./hasSize');

module.exports = function () {
	return _.extend(hasSize(0), {
		describeTo: function (description) {
			description.append('an empty collection or string');
		}
	});
};

},{"./hasSize":46}],48:[function(require,module,exports){
'use strict';

var _ = (window._);
var Description = require('./../Description');
var TypeSafeMatcher = require('./TypeSafeMatcher');
var isMatcher = require('./Matcher').isMatcher;

function matches(target) {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return isMatcher(actual);
		},
		matchesSafely: function (actual) {
			return actual.matches(target);
		},
		describeTo: function (description) {
			description.append('a matcher matching ')
				.appendValue(target);
		},
		describeMismatchSafely: function (actual, description) {
			var mismatchDescription = new Description();
			actual.describeMismatch(target, mismatchDescription);

			description
				.append('matcher with description ')
				.appendValue(new Description()
					.appendDescriptionOf(actual)
					.get()
				)
				.append(' failed to match and explained: ')
				.appendValue(mismatchDescription.get());
		}
	});
}

module.exports = matches;

},{"./../Description":2,"./Matcher":39,"./TypeSafeMatcher":42}],49:[function(require,module,exports){
'use strict';

var _ = (window._);
var q = (window.Q);

function resolve(promises) {
	if (_.isArray(promises)) {
		return q.all(promises);
	} else {
		var result = {};
		_.forEach(promises, function (promiseOrValue, key) {
			result[key] = null;
			q(promiseOrValue).then(function (value) {
				result[key] = value;
			});
		});
		return q.all(_.toArray(promises)).then(function () {
			return result;
		});
	}
}

var promiseAgnostic = {
	matches: function (result, handler) {
		if (q.isPromiseAlike(result)) {
			return q(result).then(handler);
		} else {
			return handler(result);
		}
	},
	matchesAggregate: function (results, handler) {
		if (_.any(results, q.isPromiseAlike)) {
			return resolve(results).then(handler);
		} else {
			return handler(results);
		}
	},
	describeMismatchAggregate: function (results, handler, suffixFn) {
		if (_.any(results, q.isPromiseAlike)) {
			return resolve(results).then(function (results) {
				var sequence = q();
				_.forEach(results, function (result, key) {
					sequence = sequence.then(function () {
						return handler(result, key);
					});
				});
				if (suffixFn) {
					sequence = sequence.then(suffixFn);
				}
				return sequence;
			});
		} else {
			_.forEach(results, function (result, key) {
				return handler(result, key);
			});
			if (suffixFn) {
				suffixFn();
			}
		}
	},
	describeMismatch: function (result, handler, suffixFn) {
		if (q.isPromiseAlike(result)) {
			var response = q(result).then(handler);
			if (suffixFn) {
				response = response.then(suffixFn);
			}
			return response;
		} else {
			handler(result);
			if (suffixFn) {
				suffixFn();
			}
		}
	}
};

module.exports = promiseAgnostic;

},{}],50:[function(require,module,exports){
'use strict';

var _ = (window._);
var func = require('./IsFunction').func;
var anything = require('./IsAnything').anything;
var asMatcher = require('./IsEqual').asMatcher;
var getType = require('../utils/getType');

module.exports = function returns(resultMatcherOrValue) {
	var resultMatcher = resultMatcherOrValue ? asMatcher(resultMatcherOrValue) : anything();
	return _.create(new func(), {
		matchesSafely: function (actual) {
			try {
				var result = actual();
				return resultMatcher.matches(result);
			}
			catch (e) {
				return false;
			}
		},
		describeTo: function (description) {
			description.append('a function returning ')
				.appendDescriptionOf(resultMatcher);
		},
		describeMismatchSafely: function (actual, description) {
			try {
				var result = actual();
				description.append('return value ');
				return resultMatcher.describeMismatch(result, description);
			}
			catch (e) {
				description.append('function threw ')
					.append(getType(e));
				if (e.message) {
					description.append(': ')
						.appendValue(e.message);
				}
			}
		}
	});
};

},{"../utils/getType":54,"./IsAnything":13,"./IsEqual":24,"./IsFunction":26}],51:[function(require,module,exports){
'use strict';

var _ = (window._)
	, Matcher = require('./Matcher')
	;

function truthy() {
	return _.create(new Matcher(), {
		matches: function (actualValue) {
			return !!actualValue;
		},
		describeTo: function (description) {
			description.append('truthy value');
		}
	});
}

module.exports = truthy;

},{"./Matcher":39}],52:[function(require,module,exports){
'use strict';

var asMatcher = require('./IsEqual').asMatcher;
var getType = require('../utils/getType');
var getTypeName = require('../utils/getTypeName');

module.exports = function typedError(errorType, messageMatcherOrValue) {
	var messageMatcher = asMatcher(messageMatcherOrValue);
	return {
		matches: function (actual) {
			return actual instanceof errorType &&
				messageMatcher.matches(actual.message);
		},
		describeTo: function (description) {
			description
				.append('an error of type ')
				.append(getTypeName(errorType))
				.append(' with message ')
				.appendDescriptionOf(messageMatcher);
		},
		describeMismatch: function (actual, description) {
			if (!actual) {
				description
					.append('was ')
					.appendValue(actual);
				return;
			}

			var hadTypeError;
			if (!(actual instanceof errorType)) {
				hadTypeError = true;
				description
					.append('type was ')
					.append(getType(actual));
			}
			if (!messageMatcher.matches(actual.message)) {
				if (hadTypeError) {
					description.append(', ');
				}
				description.append('message ');
				messageMatcher.describeMismatch(actual.message, description);
			}
		}
	};
};

},{"../utils/getType":54,"../utils/getTypeName":55,"./IsEqual":24}],53:[function(require,module,exports){
'use strict';

var q = (window.Q);
var AssertionError = require('assertion-error');
var Description = require('./Description');
var _ = (window._);

function promiseThat(reason, actual, matcher) {
	if (arguments.length === 2) {
		matcher = actual;
		actual = reason;
		reason = '';
	}

	return q(matcher.matches(actual)).then(function (result) {
		if (!result) {
			var description = new Description();
			description.append(reason)
				.append('\nExpected: ')
				.appendDescriptionOf(matcher)
				.append('\n     but: ');
			return q(matcher.describeMismatch(actual, description)).then(function () {
				if (!_.isFunction(matcher.getExpectedForDiff) ||
					!_.isFunction(matcher.formatActualForDiff)) {
					return {};
				}

				return q.all([
					matcher.getExpectedForDiff(),
					matcher.formatActualForDiff(actual)
				]).spread(function (expected, actual) {
					return {
						showDiff: true,
						expected: expected,
						actual: actual
					};
				});
			}).then(function (errorProperties) {
				throw new AssertionError(description.get(), errorProperties, promiseThat);
			});
		}
	});
}

module.exports = promiseThat;


},{"./Description":2,"assertion-error":56}],54:[function(require,module,exports){
'use strict';

var getTypeName = require('./getTypeName');

module.exports = function (value) {
	if (!value.constructor) {
		return '<no type>';
	}
	return getTypeName(value.constructor);
};

},{"./getTypeName":55}],55:[function(require,module,exports){
'use strict';

module.exports = function getName(type) {
	if (!type.name) {
		return 'ANONYMOUS FUNCTION';
	}

	return type.name;
};

},{}],56:[function(require,module,exports){
/*!
 * assertion-error
 * Copyright(c) 2013 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Return a function that will copy properties from
 * one object to another excluding any originally
 * listed. Returned function will create a new `{}`.
 *
 * @param {String} excluded properties ...
 * @return {Function}
 */

function exclude () {
  var excludes = [].slice.call(arguments);

  function excludeProps (res, obj) {
    Object.keys(obj).forEach(function (key) {
      if (!~excludes.indexOf(key)) res[key] = obj[key];
    });
  }

  return function extendExclude () {
    var args = [].slice.call(arguments)
      , i = 0
      , res = {};

    for (; i < args.length; i++) {
      excludeProps(res, args[i]);
    }

    return res;
  };
};

/*!
 * Primary Exports
 */

module.exports = AssertionError;

/**
 * ### AssertionError
 *
 * An extension of the JavaScript `Error` constructor for
 * assertion and validation scenarios.
 *
 * @param {String} message
 * @param {Object} properties to include (optional)
 * @param {callee} start stack function (optional)
 */

function AssertionError (message, _props, ssf) {
  var extend = exclude('name', 'message', 'stack', 'constructor', 'toJSON')
    , props = extend(_props || {});

  // default values
  this.message = message || 'Unspecified AssertionError';
  this.showDiff = false;

  // copy from properties
  for (var key in props) {
    this[key] = props[key];
  }

  // capture stack trace
  ssf = ssf || arguments.callee;
  if (ssf && Error.captureStackTrace) {
    Error.captureStackTrace(this, ssf);
  } else {
    this.stack = new Error().stack;
  }
}

/*!
 * Inherit from Error.prototype
 */

AssertionError.prototype = Object.create(Error.prototype);

/*!
 * Statically set name
 */

AssertionError.prototype.name = 'AssertionError';

/*!
 * Ensure correct constructor
 */

AssertionError.prototype.constructor = AssertionError;

/**
 * Allow errors to be converted to JSON for static transfer.
 *
 * @param {Boolean} include stack (default: `true`)
 * @return {Object} object that can be `JSON.stringify`
 */

AssertionError.prototype.toJSON = function (stack) {
  var extend = exclude('constructor', 'toJSON', 'stack')
    , props = extend({ name: this.name }, this);

  // include stack if exists and not turned off
  if (false !== stack && this.stack) {
    props.stack = this.stack;
  }

  return props;
};

},{}]},{},[1]);
