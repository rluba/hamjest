Hamjest
=======

A JavaScript implementation of [Hamcrest](http://hamcrest.org).

**Attention: The semantics of `promiseThat` has changed in `1.0.0` (hence the version bump). See below for more details.**


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
	     but: name was a number (<1337>)

Too simple? How about this:

	var collection = ['a rat', 12, 'nice, but not regular'];
	__.assertThat(collection, __.containsInAnyOrder(__.regExp(), 12, __.containsString('cat')));

	AssertionError: 
	Expected: [a regular expression, <12>, a string containing "cat"] in any order
	     but: no item in ["a rat", <12>, "nice, but not regular"] matches: a regular expression, a string containing "cat"
	     
You can also add a descriptive message to every assert, if needed:

	__.assertThat('Invalid age', age, __.lessThan(18));

	AssertionError: Invalid age
	Expected: a number less than <18>
	     but: was <18>

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
	     

## promiseThat
`promiseThat` is similar to `assertThat` can be used to wait for a given promise to be fulfilled or rejected before matching it. It returns a promise that will be fulfilled iff the given matcher matches the fulfilled/rejected input promise.

    var promise = q('future value');
    //Will return a fulfilled promise
    return __.promiseThat(promise, __.is(__.fulfilled('future value')));

    //Will return a rejected promise because the matcher does not match
    return __.promiseThat(promise, __.is(__.fulfilled('another value')));

	var deferred = q.defer();
	// The returned promise will be pending until "deferred"" is rejected or fulfilled.
    return __.promiseThat(deferred.promise, __.is(__.rejected('an error')));
    
**Attention: The semantics of `promiseThat` has changed in `1.0.0` (hence the version bump). Previously the matcher was called with the fulfilled value instead of the promise. This turned out to be of limited use because you couldn't test for rejection.**

## More matchers and examples
Have a look at the [test suite](./test/) to see lots of usage examples [for each matcher](./test/matchers/) as well as the [assertThat](./test/assertThatSpec.js) and [promiseThat](./test/promiseThatSpec.js) functions.

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


# License

Licensed under the MIT License [(enclosed)](./LICENSE). 

This library is inspired by and based on the work of the original [Hamcrest team](http://hamcrest.org).
