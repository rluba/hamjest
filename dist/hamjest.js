!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.hamjest=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

module.exports = _dereq_('./lib/hamjest');

},{"./lib/hamjest":4}],2:[function(_dereq_,module,exports){
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

var AssertionError = _dereq_('assertion-error')
	, Description = _dereq_('./Description')
	;

function assertThat(reason, actual, matcher) {
	if (arguments.length === 2) {
		matcher = actual;
		actual = reason;
		reason = '';
	}

	if (!matcher.matches(actual)) {
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

},{"./Description":2,"assertion-error":42}],4:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, IsEqual = _dereq_('./matchers/IsEqual')
	, Matcher = _dereq_('./matchers/Matcher')
	, SubstringMatcher = _dereq_('./matchers/SubstringMatcher')
	, NumberComparisonMatcher = _dereq_('./matchers/NumberComparisonMatcher')
	;

var asserts = {
	assertThat: _dereq_('./assertThat'),
	promiseThat: _dereq_('./promiseThat')
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
	rejected: _dereq_('./matchers/IsRejected').rejected
};

var utils = {
	isMatcher: Matcher.isMatcher,
	asMatcher: IsEqual.asMatcher,
	acceptingMatcher: IsEqual.acceptingMatcher
};

var hamjest = {};
_.extend(hamjest, asserts, matchers, utils);

module.exports = hamjest;

},{"./assertThat":3,"./matchers/AllOf":5,"./matchers/AnyOf":6,"./matchers/Every":7,"./matchers/FeatureMatcher":8,"./matchers/Is":9,"./matchers/IsAnything":10,"./matchers/IsArray":11,"./matchers/IsArrayContaining":12,"./matchers/IsArrayContainingInAnyOrder":13,"./matchers/IsArrayOrderedBy":14,"./matchers/IsArrayWithItem":15,"./matchers/IsArrayWithItems":16,"./matchers/IsBoolean":17,"./matchers/IsCloseTo":18,"./matchers/IsCollectionWithSize":19,"./matchers/IsDate":20,"./matchers/IsDefined":21,"./matchers/IsEqual":22,"./matchers/IsFulfilled":23,"./matchers/IsFunction":24,"./matchers/IsFunctionThrowing":25,"./matchers/IsInstanceOf":26,"./matchers/IsNot":27,"./matchers/IsNumber":28,"./matchers/IsObject":29,"./matchers/IsObjectWithProperties":30,"./matchers/IsPromise":31,"./matchers/IsRegExp":32,"./matchers/IsRejected":33,"./matchers/IsSame":34,"./matchers/IsString":35,"./matchers/IsStringMatching":36,"./matchers/Matcher":37,"./matchers/NumberComparisonMatcher":38,"./matchers/SubstringMatcher":39,"./matchers/TypeSafeMatcher":40,"./promiseThat":41}],5:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, Matcher = _dereq_('./Matcher')
	;

function AllOf(matchers) {
	return _.create(new Matcher(), {
		matches: function (actual) {
			var matched = true;
			_.forEach(matchers, function (matcher) {
				if(!matcher.matches(actual)) {
					matched = false;
					return false;
				}
			});
			return matched;
		},
		describeTo: function (description) {
			description.appendList('(', ' and ', ')', matchers);
		},
		describeMismatch: function (actual, description) {
			_.forEach(matchers, function (matcher) {
				if(!matcher.matches(actual)) {
					description
						.appendDescriptionOf(matcher)
						.append(': ');
					matcher.describeMismatch(actual, description);
					return false;
				}
			});
		}
	});
}

AllOf.allOf = function () {
	return new AllOf(arguments);
};

module.exports = AllOf;

},{"./Matcher":37}],6:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, Matcher = _dereq_('./Matcher')
	;

function AnyOf(matchers) {
	return _.create(new Matcher(), {
		matches: function (actual) {
			var matched = false;
			_.forEach(matchers, function (matcher) {
				if (matcher.matches(actual)) {
					matched = true;
					return false;
				}
			});
			return matched;
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

},{"./Matcher":37}],7:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = _dereq_('./TypeSafeMatcher')
	, acceptingMatcher = _dereq_('./IsEqual').acceptingMatcher
	;

var Every = acceptingMatcher(function Every(matcher) {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isArray(actual) || _.isObject(actual);
		},
		matchesSafely: function (actual) {
			var matched = true;
			_.forEach(actual, function (value) {
				if (!matcher.matches(value)) {
					matched = false;
					return false;
				}
			});
			return matched;
		},
		describeTo: function (description) {
			description
				.append('every item is ')
				.appendDescriptionOf(matcher);
		},
		describeMismatchSafely: function (actual, description) {
			var first = true;
			_.forEach(actual, function (value, key) {
				if (matcher.matches(value)) {
					return;
				}

				if (!first) {
					description.append(', ');
				}
				first = false;
				description.append('item ').appendValue(key).append(' ');
				matcher.describeMismatch(value, description);
			});
		}
	});
});

Every.everyItem = function (matcherOrValue) {
	return new Every(matcherOrValue);
};

module.exports = Every;

},{"./IsEqual":22,"./TypeSafeMatcher":40}],8:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, Matcher = _dereq_('./Matcher')
	, asMatcher = _dereq_('./IsEqual').asMatcher
	;

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
			description
				.append(featureName)
				.append(' of ')
				.appendValue(actual)
				.append(' ');
			matcher.describeMismatch(featureFunction(actual), description);
		}
	});
}

module.exports = FeatureMatcher;

},{"./IsEqual":22,"./Matcher":37}],9:[function(_dereq_,module,exports){
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
			innerMatcher.describeMismatch(value, description);
		}
	});
});

Is.is = function (innerMatcher) {
	return new Is(innerMatcher);
};

module.exports = Is;

},{"./IsEqual":22,"./Matcher":37}],10:[function(_dereq_,module,exports){
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

},{"./Matcher":37}],11:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = _dereq_('./TypeSafeMatcher')
	;

function IsArray() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isArray(actual);
		},
		matchesSafely: function () {
			return true;
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

},{"./TypeSafeMatcher":40}],12:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, IsArray = _dereq_('./IsArray')
	, asMatcher = _dereq_('./IsEqual').asMatcher
	;

function IsArrayContaining(itemsOrMatchers) {
	var matchers = _.map(itemsOrMatchers, asMatcher);
	return _.create(new IsArray(), {
		matchesSafely: function (actual) {
			if (actual.length !== matchers.length) {
				return false;
			}
			var matched = true;
			_.forEach(actual, function (item, index) {
				if (!matchers[index].matches(item)) {
					matched = false;
					return false;
				}
			});
			return matched;
		},
		describeTo: function (description) {
			description.appendList('[', ', ', ']', matchers);
		},
		describeMismatchSafely: function (actual, description) {
			var firstMismatch;
			_.forEach(actual, function (item, index) {
				if (matchers.length > index && !matchers[index].matches(item)) {
					firstMismatch = index;
					return false;
				}
			});
			if (!_.isUndefined(firstMismatch)) {
				description
					.append('item ')
					.append(firstMismatch)
					.append(': ');
				matchers[firstMismatch].describeMismatch(actual[firstMismatch], description);
				return;
			}

			if (actual.length > matchers.length) {
				description
					.appendList('not matched: ', ', ', '', actual.slice(matchers.length));
			}
			else if (actual.length < matchers.length) {
				description
					.appendList('missing: ', ', ', '', matchers.slice(actual.length));
			}
		}
	});
}

IsArrayContaining.contains = function () {
	return new IsArrayContaining(arguments);
};

module.exports = IsArrayContaining;

},{"./IsArray":11,"./IsEqual":22}],13:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, IsArray = _dereq_('./IsArray')
	, asMatcher = _dereq_('./IsEqual').asMatcher
	;

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

},{"./IsArray":11,"./IsEqual":22}],14:[function(_dereq_,module,exports){
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

},{"./IsArray":11}],15:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, IsArray = _dereq_('./IsArray')
	, acceptingMatcher = _dereq_('./IsEqual').acceptingMatcher
	;

var IsArrayWithItem = acceptingMatcher(function IsArrayWithItem(matcher) {
	return _.create(new IsArray(), {
		matchesSafely: function (actual) {
			var matched = false;
			_.forEach(actual, function (value) {
				if (matcher.matches(value)) {
					matched = true;
					return false;
				}
			});
			return matched;
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

			description.append('[');
			var first = true;
			_.forEach(actual, function (value) {
				if (!first) {
					description.append(', ');
				}
				first = false;
				matcher.describeMismatch(value, description);
			});
			description.append(']');
		}
	});
});

IsArrayWithItem.hasItem = function (matcherOrValue) {
	return new IsArrayWithItem(matcherOrValue);
};

module.exports = IsArrayWithItem;

},{"./IsArray":11,"./IsEqual":22}],16:[function(_dereq_,module,exports){
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

},{"./AllOf":5,"./IsArray":11,"./IsArrayWithItem":15,"./IsEqual":22}],17:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = _dereq_('./TypeSafeMatcher')
	;

function IsBoolean() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isBoolean(actual);
		},
		matchesSafely: function () {
			return true;
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

},{"./TypeSafeMatcher":40}],18:[function(_dereq_,module,exports){
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

},{"../assertThat":3,"./Is":9,"./IsNumber":28}],19:[function(_dereq_,module,exports){
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

},{"./FeatureMatcher":8,"./TypeSafeMatcher":40}],20:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = _dereq_('./TypeSafeMatcher')
	;

function IsDate() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isDate(actual);
		},
		matchesSafely: function () {
			return true;
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

},{"./TypeSafeMatcher":40}],21:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, Matcher = _dereq_('./Matcher')
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

module.exports = IsDefined;

},{"./Matcher":37}],22:[function(_dereq_,module,exports){
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

},{"./Matcher":37}],23:[function(_dereq_,module,exports){
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
			if (!q.isFulfilled(actual)) {
				return false;
			}

			return valueMatcher.matches(actual.inspect().value);
		},
		describeTo: function (description) {
			description.append('fulfilled promise');
			if (!anyValue) {
				description.append(' (');
				valueMatcher.describeTo(description);
				description.append(')');
			}
		},
		describeMismatchSafely: function (actual, description) {
			if (!q.isFulfilled(actual)) {
				description
					.append('was not fulfilled (')
					.appendValue(actual.inspect())
					.append(')');
			}
			else {
				description
					.append('was fulfilled with ')
					.appendValue(actual.inspect().value);
			}
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

module.exports = IsFulfilled;

},{"./IsAnything":10,"./IsEqual":22,"./IsPromise":31}],24:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = _dereq_('./TypeSafeMatcher')
	;

function IsFunction() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isFunction(actual);
		},
		matchesSafely: function () {
			return true;
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

},{"./TypeSafeMatcher":40}],25:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, IsFunction = _dereq_('./IsFunction')
	, instanceOf = _dereq_('./IsInstanceOf').instanceOf
	, anything = _dereq_('./IsAnything').anything
	;

function IsFunctionThrowing(type) {
	var anyType = (arguments.length === 0);
	var typeMatcher = (anyType ? anything() : instanceOf(type));
	return _.create(new IsFunction(), {
		matchesSafely: function (throwingFunction) {
			try {
				throwingFunction();
				return false;
			}
			catch(e) {
				return typeMatcher.matches(e);
			}
		},
		describeTo: function (description) {
			description.append('a function throwing ');
			typeMatcher.describeTo(description);
		},
		describeMismatch: function (throwingFunction, description) {
			try {
				throwingFunction();
				description.append('did not throw anything');
			}
			catch(e) {
				typeMatcher.describeMismatch(e, description);
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

},{"./IsAnything":10,"./IsFunction":24,"./IsInstanceOf":26}],26:[function(_dereq_,module,exports){
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

},{"../assertThat":3,"./Is":9,"./IsFunction":24,"./Matcher":37}],27:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, Matcher = _dereq_('./Matcher')
	, acceptingMatcher = _dereq_('./IsEqual').acceptingMatcher
	;

var IsNot = acceptingMatcher(function IsNot(innerMatcher) {
	return _.create(new Matcher(), {
		matches: function (actualValue) {
			return !innerMatcher.matches(actualValue);
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

},{"./IsEqual":22,"./Matcher":37}],28:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = _dereq_('./TypeSafeMatcher')
	;

function IsNumber() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isNumber(actual);
		},
		matchesSafely: function () {
			return true;
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

},{"./TypeSafeMatcher":40}],29:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = _dereq_('./TypeSafeMatcher')
	;

function IsObject() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isObject(actual);
		},
		matchesSafely: function () {
			return true;
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

},{"./TypeSafeMatcher":40}],30:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = _dereq_('./TypeSafeMatcher')
	, asMatcher = _dereq_('./IsEqual').asMatcher
	, defined = _dereq_('./IsDefined').defined
	;

function IsObjectWithProperties(properties) {
	var propertyMatchers = _.mapValues(properties, asMatcher);
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isObject(actual);
		},
		matchesSafely: function (actual) {
			var matched = true;
			_.forEach(propertyMatchers, function (matcher, key) {
				if (!matcher.matches(actual[key])) {
					matched = false;
					return false;
				}
			});
			return matched;
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
			var first = true;
			_.forEach(propertyMatchers, function (matcher, key) {
				var propertyValue = actual[key];
				if (!matcher.matches(propertyValue)) {
					if (!first) {
						description.append(', ');
					}
					first = false;

					description
						.append(key)
						.append(' ');
					matcher.describeMismatch(actual[key], description);
				}
			});
		}
	});
}

IsObjectWithProperties.hasProperties = function (properties) {
	return new IsObjectWithProperties(properties);
};

IsObjectWithProperties.hasProperty = function (name, valueOrMatcher) {
	var properties = {};
	properties[name] = valueOrMatcher || defined();
	return new IsObjectWithProperties(properties);
};

module.exports = IsObjectWithProperties;

},{"./IsDefined":21,"./IsEqual":22,"./TypeSafeMatcher":40}],31:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, q = (window.Q)
	, TypeSafeMatcher = _dereq_('./TypeSafeMatcher')
	;

function IsPromise() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return q.isPromise(actual);
		},
		matchesSafely: function () {
			return true;
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

},{"./TypeSafeMatcher":40}],32:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = _dereq_('./TypeSafeMatcher')
	;

function IsRegExp() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isRegExp(actual);
		},
		matchesSafely: function () {
			return true;
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

},{"./TypeSafeMatcher":40}],33:[function(_dereq_,module,exports){
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
			if (!q.isRejected(actual)) {
				return false;
			}

			return valueMatcher.matches(actual.inspect().reason);
		},
		describeTo: function (description) {
			description.append('rejected promise');
			if (!anyValue) {
				description.append(' (');
				valueMatcher.describeTo(description);
				description.append(')');
			}
		},
		describeMismatchSafely: function (actual, description) {
			if (!q.isRejected(actual)) {
				description
					.append('was not rejected (')
					.appendValue(actual.inspect())
					.append(')');
			}
			else {
				description
					.append('was rejected with ')
					.appendValue(actual.inspect().reason);
			}
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

module.exports = IsRejected;

},{"./IsAnything":10,"./IsEqual":22,"./IsPromise":31}],34:[function(_dereq_,module,exports){
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

},{"./Matcher":37}],35:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, TypeSafeMatcher = _dereq_('./TypeSafeMatcher')
	;

function IsString() {
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: function (actual) {
			return _.isString(actual);
		},
		matchesSafely: function () {
			return true;
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

},{"./TypeSafeMatcher":40}],36:[function(_dereq_,module,exports){
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

},{"../assertThat":3,"./AnyOf":6,"./IsRegExp":32,"./IsString":35}],37:[function(_dereq_,module,exports){
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

},{}],38:[function(_dereq_,module,exports){
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

},{"../assertThat":3,"./Is":9,"./IsNumber":28}],39:[function(_dereq_,module,exports){
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

},{"../assertThat":3,"./Is":9,"./IsString":35}],40:[function(_dereq_,module,exports){
'use strict';

var _ = (window._)
	, Matcher = _dereq_('./Matcher')
	;

function TypeSafeMatcher() {
	return _.create(new Matcher(), {
		matches: function (actual) {
			return this.isExpectedType(actual) && this.matchesSafely(actual);
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
				this.describeMismatchSafely(actual, description);
			}
		},
		isExpectedType: function () {
			throw new Error('Not implemented');
		},
		matchesSafely: function () {
			throw new Error('Not implemented');
		},
		describeMismatchSafely: function () {
			throw new Error('Not implemented');
		}
	});
}

module.exports = TypeSafeMatcher;

},{"./Matcher":37}],41:[function(_dereq_,module,exports){
'use strict';

var q = (window.Q)
	, assertThat = _dereq_('./assertThat')
	;

function promiseThat(reason, promiseOrValue, promiseMatcher) {
	if (arguments.length === 2) {
		promiseMatcher = promiseOrValue;
		promiseOrValue = reason;
		reason = '';
	}

	var promise = q(promiseOrValue);
	return promise.then(function () {
		return assertThat(reason, promise, promiseMatcher);
	}, function () {
		return assertThat(reason, promise, promiseMatcher);
	});
}

module.exports = promiseThat;


},{"./assertThat":3}],42:[function(_dereq_,module,exports){
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