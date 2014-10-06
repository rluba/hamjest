!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.hamjest=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

module.exports = _dereq_('./lib/hamjest');

},{"./lib/hamjest":5}],2:[function(_dereq_,module,exports){
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
			selfDescribing.describeTo(this);
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

},{}],3:[function(_dereq_,module,exports){
'use strict';

var q = (window.Q);
var AssertionError = _dereq_('assertion-error')
	, Description = _dereq_('./Description')
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
		throw new AssertionError(description.get(), {}, assertThat);
	}
}

module.exports = assertThat;

},{"./Description":2,"assertion-error":45}],4:[function(_dereq_,module,exports){
'use strict';

var AssertionError = _dereq_('assertion-error')
	;

function fail(reason) {
	throw new AssertionError(reason, {}, fail);
}

module.exports = fail;

},{"assertion-error":45}],5:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, IsEqual = _dereq_('./matchers/IsEqual')
	, Matcher = _dereq_('./matchers/Matcher')
	, SubstringMatcher = _dereq_('./matchers/SubstringMatcher')
	, NumberComparisonMatcher = _dereq_('./matchers/NumberComparisonMatcher')
	;

var asserts = {
	assertThat: _dereq_('./assertThat'),
	promiseThat: _dereq_('./promiseThat'),
	fail: _dereq_('./fail')
};

var matchers = {
	Matcher: Matcher,
	TypeSafeMatcher: _dereq_('./matchers/TypeSafeMatcher'),
	FeatureMatcher: _dereq_('./matchers/FeatureMatcher'),

	anything: _dereq_('./matchers/IsAnything').anything,
	strictlyEqualTo: _dereq_('./matchers/IsSame').strictlyEqualTo,
	is: _dereq_('./matchers/Is').is,
	not: _dereq_('./matchers/IsNot').not,
	equalTo: IsEqual.equalTo,
	defined: _dereq_('./matchers/IsDefined').defined,
	undefined: _dereq_('./matchers/IsDefined').undefined,
	instanceOf: _dereq_('./matchers/IsInstanceOf').instanceOf,
	array: _dereq_('./matchers/IsArray').array,
	bool: _dereq_('./matchers/IsBoolean').bool,
	date: _dereq_('./matchers/IsDate').date,
	func: _dereq_('./matchers/IsFunction').func,
	number: _dereq_('./matchers/IsNumber').number,
	object: _dereq_('./matchers/IsObject').object,
	regExp: _dereq_('./matchers/IsRegExp').regExp,
	string: _dereq_('./matchers/IsString').string,
	containsString: SubstringMatcher.containsString,
	startsWith: SubstringMatcher.startsWith,
	endsWith: SubstringMatcher.endsWith,
	matchesPattern: _dereq_('./matchers/IsStringMatching').matchesPattern,
	lessThan: NumberComparisonMatcher.lessThan,
	lessThanOrEqualTo: NumberComparisonMatcher.lessThanOrEqualTo,
	greaterThan: NumberComparisonMatcher.greaterThan,
	greaterThanOrEqualTo: NumberComparisonMatcher.greaterThanOrEqualTo,
	closeTo: _dereq_('./matchers/IsCloseTo').closeTo,
	allOf: _dereq_('./matchers/AllOf').allOf,
	anyOf: _dereq_('./matchers/AnyOf').anyOf,
	everyItem: _dereq_('./matchers/Every').everyItem,
	hasItem: _dereq_('./matchers/IsArrayWithItem').hasItem,
	hasItems: _dereq_('./matchers/IsArrayWithItems').hasItems,
	contains: _dereq_('./matchers/IsArrayContaining').contains,
	containsInAnyOrder: _dereq_('./matchers/IsArrayContainingInAnyOrder').containsInAnyOrder,
	orderedBy: _dereq_('./matchers/IsArrayOrderedBy').orderedBy,
	hasSize: _dereq_('./matchers/IsCollectionWithSize').hasSize,
	hasProperties: _dereq_('./matchers/IsObjectWithProperties').hasProperties,
	hasProperty: _dereq_('./matchers/IsObjectWithProperties').hasProperty,
	throws: _dereq_('./matchers/IsFunctionThrowing').throws,
	promise: _dereq_('./matchers/IsPromise').promise,
	fulfilled: _dereq_('./matchers/IsFulfilled').fulfilled,
	isFulfilledWith: _dereq_('./matchers/IsFulfilled').isFulfilledWith,
	willBe: _dereq_('./matchers/IsFulfilled').isFulfilledWith,
	rejected: _dereq_('./matchers/IsRejected').rejected,
	isRejectedWith: _dereq_('./matchers/IsRejected').isRejectedWith,
	promiseAllOf: _dereq_('./matchers/allOf').allOf
};

var utils = {
	isMatcher: Matcher.isMatcher,
	asMatcher: IsEqual.asMatcher,
	acceptingMatcher: IsEqual.acceptingMatcher
};

var hamjest = {};
_.extend(hamjest, asserts, matchers, utils);

module.exports = hamjest;

},{"./assertThat":3,"./fail":4,"./matchers/AllOf":6,"./matchers/AnyOf":7,"./matchers/Every":8,"./matchers/FeatureMatcher":9,"./matchers/Is":10,"./matchers/IsAnything":11,"./matchers/IsArray":12,"./matchers/IsArrayContaining":13,"./matchers/IsArrayContainingInAnyOrder":14,"./matchers/IsArrayOrderedBy":15,"./matchers/IsArrayWithItem":16,"./matchers/IsArrayWithItems":17,"./matchers/IsBoolean":18,"./matchers/IsCloseTo":19,"./matchers/IsCollectionWithSize":20,"./matchers/IsDate":21,"./matchers/IsDefined":22,"./matchers/IsEqual":23,"./matchers/IsFulfilled":24,"./matchers/IsFunction":25,"./matchers/IsFunctionThrowing":26,"./matchers/IsInstanceOf":27,"./matchers/IsNot":28,"./matchers/IsNumber":29,"./matchers/IsObject":30,"./matchers/IsObjectWithProperties":31,"./matchers/IsPromise":32,"./matchers/IsRegExp":33,"./matchers/IsRejected":34,"./matchers/IsSame":35,"./matchers/IsString":36,"./matchers/IsStringMatching":37,"./matchers/Matcher":38,"./matchers/NumberComparisonMatcher":39,"./matchers/SubstringMatcher":40,"./matchers/TypeSafeMatcher":41,"./matchers/allOf":42,"./promiseThat":44}],6:[function(_dereq_,module,exports){
'use strict';

var _ = (window._);
var Matcher = _dereq_('./Matcher');
var promiseAgnostic = _dereq_('./promiseAgnostic');

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

},{"./Matcher":38,"./promiseAgnostic":43}],7:[function(_dereq_,module,exports){
'use strict';

var _ = (window._);
var Matcher = _dereq_('./Matcher');

var promiseAgnostic = _dereq_('./promiseAgnostic');

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

},{"./Matcher":38,"./promiseAgnostic":43}],8:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = _dereq_('./TypeSafeMatcher')
	, acceptingMatcher = _dereq_('./IsEqual').acceptingMatcher
	;
var promiseAgnostic = _dereq_('./promiseAgnostic');

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

},{"./IsEqual":23,"./TypeSafeMatcher":41,"./promiseAgnostic":43}],9:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, Matcher = _dereq_('./Matcher')
	, asMatcher = _dereq_('./IsEqual').asMatcher
	;

var promiseAgnostic = _dereq_('./promiseAgnostic');

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
			return promiseAgnostic.describeMismatch(matcher.matches(actual), function () {
				description
					.append(featureName)
					.append(' ');
				return matcher.describeMismatch(featureFunction(actual),description);
			}, function () {
				description
					.append('\nfor ')
					.appendValue(actual);
			});
		}
	});
}

module.exports = FeatureMatcher;

},{"./IsEqual":23,"./Matcher":38,"./promiseAgnostic":43}],10:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, Matcher = _dereq_('./Matcher')
	, acceptingMatcher = _dereq_('./IsEqual').acceptingMatcher
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
		}
	});
});

Is.is = function (innerMatcher) {
	return new Is(innerMatcher);
};

module.exports = Is;

},{"./IsEqual":23,"./Matcher":38}],11:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, Matcher = _dereq_('./Matcher')
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

},{"./Matcher":38}],12:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = _dereq_('./TypeSafeMatcher')
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

},{"./TypeSafeMatcher":41}],13:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, IsArray = _dereq_('./IsArray')
	, asMatcher = _dereq_('./IsEqual').asMatcher
	;

var promiseAgnostic = _dereq_('./promiseAgnostic');

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

},{"./IsArray":12,"./IsEqual":23,"./promiseAgnostic":43}],14:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, IsArray = _dereq_('./IsArray')
	, asMatcher = _dereq_('./IsEqual').asMatcher
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

},{"./IsArray":12,"./IsEqual":23}],15:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, IsArray = _dereq_('./IsArray')
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

},{"./IsArray":12}],16:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, IsArray = _dereq_('./IsArray')
	, acceptingMatcher = _dereq_('./IsEqual').acceptingMatcher
	;
var promiseAgnostic = _dereq_('./promiseAgnostic');

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

},{"./IsArray":12,"./IsEqual":23,"./promiseAgnostic":43}],17:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, IsArray = _dereq_('./IsArray')
	, hasItem = _dereq_('./IsArrayWithItem').hasItem
	, AllOf = _dereq_('./AllOf')
	, asMatcher = _dereq_('./IsEqual').asMatcher
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

},{"./AllOf":6,"./IsArray":12,"./IsArrayWithItem":16,"./IsEqual":23}],18:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = _dereq_('./TypeSafeMatcher')
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

},{"./TypeSafeMatcher":41}],19:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, IsNumber = _dereq_('./IsNumber')
	, assertThat = _dereq_('../assertThat')
	, is = _dereq_('./Is').is
	, number = _dereq_('./IsNumber').number
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

},{"../assertThat":3,"./Is":10,"./IsNumber":29}],20:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = _dereq_('./TypeSafeMatcher')
	, FeatureMatcher = _dereq_('./FeatureMatcher')
	;

function IsCollectionWithSize(matcherOrValue) {
	var innerMatcher = new FeatureMatcher(matcherOrValue, 'a collection with size', 'size', function (item) {
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
}

IsCollectionWithSize.hasSize = function (matcherOrValue) {
	return new IsCollectionWithSize(matcherOrValue);
};

module.exports = IsCollectionWithSize;

},{"./FeatureMatcher":9,"./TypeSafeMatcher":41}],21:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = _dereq_('./TypeSafeMatcher')
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

},{"./TypeSafeMatcher":41}],22:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, Matcher = _dereq_('./Matcher')
	, not = _dereq_('./IsNot').not
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

},{"./IsNot":28,"./Matcher":38}],23:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, Matcher = _dereq_('./Matcher')
	;

function IsEqual(expectedValue) {
	return _.create(new Matcher(), {
		matches: function (actualValue) {
			return _.isEqual(expectedValue, actualValue);
		},
		describeTo: function (description) {
			description.appendValue(expectedValue);
		}
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

},{"./Matcher":38}],24:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, q = (window.Q)
	, IsPromise = _dereq_('./IsPromise')
	, asMatcher = _dereq_('./IsEqual').asMatcher
	, anything = _dereq_('./IsAnything').anything
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
				}
				else {
					description
						.append('was fulfilled with ')
						.appendValue(qPromise.inspect().value);
				}
				deferred.resolve();
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

},{"./IsAnything":11,"./IsEqual":23,"./IsPromise":32}],25:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = _dereq_('./TypeSafeMatcher')
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

},{"./TypeSafeMatcher":41}],26:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, IsFunction = _dereq_('./IsFunction')
	, asMatcher = _dereq_('./IsEqual').asMatcher
	, anything = _dereq_('./IsAnything').anything
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

},{"./IsAnything":11,"./IsEqual":23,"./IsFunction":25}],27:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, Matcher = _dereq_('./Matcher')
	, assertThat = _dereq_('../assertThat')
	, is = _dereq_('./Is').is
	, func = _dereq_('./IsFunction').func
	;

function getName(type) {
	if (!type.name) {
		return 'ANONYMOUS FUNCTION';
	}

	return type.name;
}

function IsInstanceOf(expectedType) {
	assertThat(expectedType, is(func()));

	return _.create(new Matcher(), {
		matches: function (actual) {
			return actual instanceof expectedType;
		},
		describeTo: function (description) {
			description
				.append('an instance of ')
				.append(getName(expectedType));
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
				.append(getName(actual.constructor));
		}
	});
}

IsInstanceOf.instanceOf = function (operand) {
	return new IsInstanceOf(operand);
};

module.exports = IsInstanceOf;

},{"../assertThat":3,"./Is":10,"./IsFunction":25,"./Matcher":38}],28:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, Matcher = _dereq_('./Matcher')
	, acceptingMatcher = _dereq_('./IsEqual').acceptingMatcher
	;
var promiseAgnostic = _dereq_('./promiseAgnostic');

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

},{"./IsEqual":23,"./Matcher":38,"./promiseAgnostic":43}],29:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = _dereq_('./TypeSafeMatcher')
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

},{"./TypeSafeMatcher":41}],30:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = _dereq_('./TypeSafeMatcher')
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

},{"./TypeSafeMatcher":41}],31:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, IsObject = _dereq_('./IsObject')
	, asMatcher = _dereq_('./IsEqual').asMatcher
	, defined = _dereq_('./IsDefined').defined
	;
var promiseAgnostic = _dereq_('./promiseAgnostic');

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

},{"./IsDefined":22,"./IsEqual":23,"./IsObject":30,"./promiseAgnostic":43}],32:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, q = (window.Q)
	, TypeSafeMatcher = _dereq_('./TypeSafeMatcher')
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

},{"./TypeSafeMatcher":41}],33:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = _dereq_('./TypeSafeMatcher')
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

},{"./TypeSafeMatcher":41}],34:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, q = (window.Q)
	, IsPromise = _dereq_('./IsPromise')
	, asMatcher = _dereq_('./IsEqual').asMatcher
	, anything = _dereq_('./IsAnything').anything
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

},{"./IsAnything":11,"./IsEqual":23,"./IsPromise":32}],35:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, Matcher = _dereq_('./Matcher')
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

},{"./Matcher":38}],36:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = _dereq_('./TypeSafeMatcher')
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

},{"./TypeSafeMatcher":41}],37:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, IsString = _dereq_('./IsString')
	, assertThat = _dereq_('../assertThat')
	, anyOf = _dereq_('./AnyOf').anyOf
	, string = _dereq_('./IsString').string
	, regExp = _dereq_('./IsRegExp').regExp
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

},{"../assertThat":3,"./AnyOf":7,"./IsRegExp":33,"./IsString":36}],38:[function(_dereq_,module,exports){
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

},{}],39:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, IsNumber = _dereq_('./IsNumber')
	, assertThat = _dereq_('../assertThat')
	, is = _dereq_('./Is').is
	, number = _dereq_('./IsNumber').number
	;

function NumberComparisonMatcher(threshold, relation, matchesNumber) {
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
		return new NumberComparisonMatcher(threshold, 'greater than', function (actual) {
			return actual > threshold;
		});
	},
	greaterThanOrEqualTo: function (threshold) {
		return new NumberComparisonMatcher(threshold, 'greater than or equal to', function (actual) {
			return actual >= threshold;
		});
	},
	lessThan: function (threshold) {
		return new NumberComparisonMatcher(threshold, 'less than', function (actual) {
			return actual < threshold;
		});
	},
	lessThanOrEqualTo: function (threshold) {
		return new NumberComparisonMatcher(threshold, 'less than or equal to', function (actual) {
			return actual <= threshold;
		});
	}
});

module.exports = NumberComparisonMatcher;

},{"../assertThat":3,"./Is":10,"./IsNumber":29}],40:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, IsString = _dereq_('./IsString')
	, assertThat = _dereq_('../assertThat')
	, is = _dereq_('./Is').is
	, string = _dereq_('./IsString').string
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
		}
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

},{"../assertThat":3,"./Is":10,"./IsString":36}],41:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, Matcher = _dereq_('./Matcher')
	;

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
				if(_.isUndefined(actual)) {
					description.append('was undefined');
					return;
				}

				description
					.append('was a ')
					.append(typeof actual)
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

},{"./Matcher":38}],42:[function(_dereq_,module,exports){
module.exports=_dereq_(6)
},{"./Matcher":38,"./promiseAgnostic":43}],43:[function(_dereq_,module,exports){
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

},{}],44:[function(_dereq_,module,exports){
'use strict';

var q = (window.Q);
var AssertionError = _dereq_('assertion-error');
var Description = _dereq_('./Description');

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
				throw new AssertionError(description.get(), {}, promiseThat);
			});
		}
	});
}

module.exports = promiseThat;


},{"./Description":2,"assertion-error":45}],45:[function(_dereq_,module,exports){
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

},{}]},{},[1])
(1)
});