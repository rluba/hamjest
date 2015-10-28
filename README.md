# Hamjest
A JavaScript implementation of [Hamcrest](http://hamcrest.org).

See the [matcher documentation](https://github.com/rluba/hamjest/wiki/Matcher-documentation) for a list of available matchers.

Unlinke other JS Hamcrest libraries, it

* tries to deliver meaningful and readable (mismatch) descriptions, even for arbitrary JavaScript objects,
* uses deep equivalence (without coercion) as default matcher - instead of '==' or '===',
* has builtin support for [promises](http://promises-aplus.github.io/promises-spec/) using the [Q library](http://documentup.com/kriskowal/q/),
* lets [Lo-Dash](http://lodash.com) do some of the heavy lifting (because you can't do it any better by yourself),
* uses [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode) for all source and test files,
* is designed as a first-class [NPM module](https://npmjs.org),
* also has a build for browsers (i.e. you can use it in [Karma](http://karma-runner.github.io) tests and whatnot),
* has an extensive suite of [Mocha](http://visionmedia.github.io/mocha/) tests,
* uses [Grunt](http://gruntjs.com) as build system, so it does not depend on Python or Ruby.

# Installation
Hamjest is available via [NPM](https://npmjs.org/package/hamjest):

    npm install hamjest --save-dev
    
# Usage

All asserts and matchers are available as children of the `hamjest` module, so just require it, give it an unobtrusive name and start matching:

	var __ = require('hamjest');
	
	__.assertThat('jim the rat', __.containsString('rat'));
	__.assertThat(5, __.is(__.greaterThan(2)));
	__.assertThat([5, 12, 9], __.hasItem(__.greaterThanOrEqualTo(11)));
    
The best thing about Hamjest are its error messages, just like the Java original:

	var sut = {name: 1337, age: 25};
	__.assertThat(sut, __.hasProperties({name: __.string(), age: __.greaterThan(18)}));

	AssertionError: 
	Expected: an object with {name: a string, age: a number greater than <18>}
	     but: name was a Number (<1337>)
	     
You can also add a descriptive message to every assert, if needed:

	__.assertThat('Invalid age', age, __.lessThan(18));

	AssertionError: Invalid age
	Expected: a number less than <18>
	     but: was <18>

See the [matcher documentation](https://github.com/rluba/hamjest/wiki/Matcher-documentation) for a list of available matchers.

Have a look at the [test suite](./test/) to see lots of usage examples [for each matcher](./test/matchers/) as well as the [assertThat](./test/assertThatSpec.js) and [promiseThat](./test/promiseThatSpec.js) functions.

See the [documentation about promises](https://github.com/rluba/hamjest/wiki/Hamjest-and-Promises) for details about using Hamjest with promises or asserting asynchronously.

## JSON descriptions

Notice how the mismatching value is described as part of the AssertionError, so you don't have to fire up the debugger every time an assertion fails. This also works for arbitrary JavaScript objects:

	__.assertThat({name: 'custom object'}, __.equalTo({name: 'another object'}));

    AssertionError: 
	Expected: {"name":"another object"}
	     but: was {"name":"custom object"}	

## FeatureMatcher
Not impressed? I'll give it another try, using the builtin `FeatureMatcher`:

	// Define a custom matcher using FeatureMatcher:
	function animalWithName(matcherOrValue) {
		return new __.FeatureMatcher(matcherOrValue, 'animal with name', 'name');
	}

	var animal = {name: 'Bob', age: 12};
	__.assertThat(animal, __.is(animalWithName('Tom')));

	AssertionError: 
	Expected: is animal with name "Tom"
	     but: name of {"name":"Bob","age":12} was "Bob"
	     
By default, FeatureMatcher tries to find a property with the given feature name (the third parameter), but you can pass in an optional feature function:

	function animalWithNameLength(matcherOrValue) {
		return new __.FeatureMatcher(matcherOrValue, 'animal with name length', 'name length', function (item) {
			return item.name.length;
		});
	}

	var animal = {name: 'bob', age: 12};
	__.assertThat(animal, __.is(animalWithNameLength(__.greaterThan(5))));

	AssertionError: 
	Expected: is animal with name length a number greater than <5>
	     but: name length of {"name":"bob","age":12} was <3>
	     

## Suggestions
Do you have an idea how to make a matcher's error description even more readable? Does Hamjest lack a crucial matcher? (I'm sure it does...)

Just drop me a message or - even better - send me a pull request.

# Browser support
Hamjest also runs in the browser - thanks to [browserify](http://browserify.org/).

Use `dist/hamjest(.min).js` if [Lo-Dash](http://lodash.com) is already part of you test / app page. If you need promise support, you also have to include the [Q library](http://documentup.com/kriskowal/q/).

If you have neither Lo-Dash nor Q and don't want to include them yourself, you can use `dist/hamjest-deps(.min).js` instead. It comes with "batteries included" and none of the dependencies are leaked into global scope.

Both files export a single global: `hamjest`. You can rename it as usual for better readability:

```
	var __ = hamjest;

	__.assertThat('2007-05-01', __.startsWith('2007'));
	
```

# Breaking changes between versions
## v0.x to v1.0
### promiseThat
The semantics of `promiseThat` has changed in `1.0.0` Previously the sub-matcher was called with the fulfilled value instead of the promise. This turned out to be of limited use because you couldn't test for rejection.

## v1.x to v2.0
### throws
`throws` now behaves like other matchers that accept a sub-matcher. If an argument is provided, it can now be a matcher or an arbitrary value, i.e. it is wrapped with `equalTo`, if it is not a matcher.

Previously, the argument had to be the expected exception type and was always wrapped in `instanceOf`. To get the old behavior, change
    
    __.assertThat(fn, __.throws(AssertionError))

to

    __.assertThat(fn, __.throws(__.instanceOf(AssertionError)))

# License

Licensed under the MIT License [(enclosed)](./LICENSE). 

This library is inspired by and based on the work of the original [Hamcrest team](http://hamcrest.org).
