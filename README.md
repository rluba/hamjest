# Hamjest

A library of composable matchers for defining meaningful and readable assertions in JavaScript. Based on [Hamcrest](http://hamcrest.org).

# Why?

Because readable assertions and readable _assertion errors_ really matter. Failing with `Expected false to equal true` just doesn't cut it. Matcher-based assertions help you extend and maintain large test suites by explaining _why exactly_ an assertion failed.

See the [matcher documentation](https://github.com/rluba/hamjest/wiki/Matcher-documentation) for a list of available matchers.

Hamjest…

* … tries to deliver meaningful and readable error descriptions, even for arbitrary JavaScript objects,
* … uses deep equivalence (without coercion) as default matcher - instead of '==' or '===',
* … has builtin support for asynchronous tests and assertions using promises,
* … lets [Lodash](http://lodash.com) do some of the heavy lifting (because you can't do it any better by yourself),
* … is designed as a first-class [NPM module](https://npmjs.org/hamjest),
* … has a build for browsers (i.e. you can use it in [Karma](http://karma-runner.github.io) tests and whatnot),
* … has an extensive suite of [Mocha](http://mochajs.org/) tests

# Installation
Hamjest is available via [NPM](https://npmjs.org/package/hamjest):

```Shell
npm install hamjest --save-dev
```

# Usage

All asserts and matchers are available as children of the `hamjest` module, so just require it, give it an unobtrusive name and start matching:

```JavaScript
const __ = require('hamjest');
	
__.assertThat('jim the rat', __.containsString('rat'));
__.assertThat(5, __.is(__.greaterThan(2)));
__.assertThat([5, 12, 9], __.hasItem(__.greaterThanOrEqualTo(11)));
```

If you’re a TypeScript fan, you can use that as well:
```TypeScript
// You can use destructuring imports if you like…
import {assertThat, is, greaterThan} from 'hamjest';

assertThat(42, is(greaterThan(21)));
```


The best thing about Hamjest are its error messages, just like the [Java original](http://hamcrest.org):

```JavaScript
const sut = {name: 1337, age: 25};
__.assertThat(sut, __.hasProperties({name: __.string(), age: __.greaterThan(18)}));

AssertionError: 
Expected: an object with {name: a string, age: a number greater than <18>}
     but: name was a Number (<1337>)
```

You can also add a descriptive message to every assert, if needed:

```JavaScript
__.assertThat('Invalid age', age, __.lessThan(18));

AssertionError: Invalid age
Expected: a number less than <18>
     but: was <18>
```

See the [matcher documentation](https://github.com/rluba/hamjest/wiki/Matcher-documentation) for a list of available matchers.

Have a look at the [test suite](./test/node/) to see lots of usage examples [for each matcher](./test/node/matchers/) as well as the [assertThat](./test/node/assertThatSpec.js) and [promiseThat](./test/node/promiseThatSpec.js) functions.

See the [documentation about promises](https://github.com/rluba/hamjest/wiki/Hamjest-and-Promises) for details about using Hamjest with promises or asserting asynchronously.

## JSON descriptions

Notice how the mismatching value is described as part of the AssertionError, so you don't have to fire up the debugger every time an assertion fails. This also works for arbitrary JavaScript objects:

```JavaScript
__.assertThat({name: 'custom object'}, __.equalTo({name: 'another object'}));

AssertionError: 
Expected: {"name":"another object"}
     but: was {"name":"custom object"}	
```

## FeatureMatcher
Not impressed? I'll give it another try, using the builtin `FeatureMatcher`:

```JavaScript
// Define a custom matcher using FeatureMatcher:
function animalWithName(valueOrMatcher) {
	return new __.FeatureMatcher(valueOrMatcher, 'animal with name', 'name');
}

const animal = {name: 'Bob', age: 12};
__.assertThat(animal, __.is(animalWithName('Tom')));

AssertionError: 
Expected: is animal with name "Tom"
     but: name of {"name":"Bob","age":12} was "Bob"
```

By default, FeatureMatcher tries to find a property with the given feature name (the third parameter), but you can pass in an optional feature function:

```JavaScript
function animalWithNameLength(valueOrMatcher) {
	return new __.FeatureMatcher(valueOrMatcher, 'animal with name length', 'name length', function (item) {
		return item.name.length;
	});
}

const animal = {name: 'bob', age: 12};
__.assertThat(animal, __.is(animalWithNameLength(__.greaterThan(5))));

AssertionError: 
Expected: is animal with name length a number greater than <5>
     but: name length of {"name":"bob","age":12} was <3>
```	     

## Suggestions
Do you have an idea how to make a matcher's error description even more readable? Does Hamjest lack a crucial matcher? (I'm sure it does...)

Just send me a message (I'm [@LubaRaph on Twitter](https://twitter.com/lubaraph)), open a ticket or - even better - send me a pull request.

# Browser support
Hamjest also runs in the browser - thanks to [browserify](http://browserify.org/).

Simply include `dist/hamjest(.min).js` in your browser tests. It comes with "batteries included" and none of the dependencies are leaked into global scope.

The browser build exports a single global: `hamjest`. You can rename it as usual for better readability:

```JavaScript
const __ = hamjest;

__.assertThat('2007-05-01', __.startsWith('2007'));
```

# Development

You need [Gulp](http://gulpjs.com) to lint and test the project and build the browser version.

```Shell
npm install -g gulp
```

Run `gulp build` to lint and test the project and update the browser files. Use `gulp dev` during development to run linting and tests whenever any JS file changes.

# Breaking changes between versions

## v2.x to v3.0

* Hamjest 3 requires at least Node.js 4.x, since it some ES6 syntax. Stick to Hamjest 2 if you still use older versions of Node.js.
* The browser version of Hamjest now always contains its own dependencies (lodash, bluebird). Previously it also offered a version that looked for these dependencies in global scope. but that caused more trouble than it solved.
* The formatting for many mismatch descriptions has changed to make them easier to read (added, indentation, newlines, …)
	
	In particular, Hamjest 3 now uses a special description format for DOM-like objects (eg. DOM nodes, [cheerio](https://www.npmjs.com/package/cheerio) objects, …) to make mismatch descriptions involving those kinds of objects easier to understand.

	I consider this a breaking change since Hamjest’s readable console messages are its primary feature.
* Replaced Q with Bluebird for all promise-related code (`promiseThat(…)`, `willBe(…)`, etc.). If you previously used any of Q's non-standard sugar methods on the promises returned by Hamjest, you'll need to switch to the equivalent [Bluebird methods](http://bluebirdjs.com/docs/api-reference.html).
* Internal: Switched from Grunt to Gulp. This might affect you if you created custom builds of Hamjest.

## v1.x to v2.0
### throws
`throws` now behaves like other matchers that accept a sub-matcher. If an argument is provided, it can now be a matcher or an arbitrary value, i.e. it is wrapped with `equalTo`, if it is not a matcher.

Previously, the argument had to be the expected exception type and was always wrapped in `instanceOf`. To get the old behavior, change
    
```JavaScript
__.assertThat(fn, __.throws(AssertionError))
```

to

```JavaScript
__.assertThat(fn, __.throws(__.instanceOf(AssertionError)))
```

## v0.x to v1.0
### promiseThat
The semantics of `promiseThat` has changed in `1.0.0` Previously the sub-matcher was called with the fulfilled value instead of the promise. This turned out to be of limited use because you couldn't test for rejection.

# License

Licensed under the MIT License [(enclosed)](./LICENSE). 

This library is inspired by and based on the work of the original [Hamcrest team](http://hamcrest.org).
