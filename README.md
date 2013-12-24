Hamjest
=======

A JavaScript implementation of [Hamcrest](http://hamcrest.org).

Unlinke other JS implementations like [JsHamcrest](https://github.com/danielfm/jshamcrest), it

* is designed as a first-class [NPM module](https://npmjs.org) (a build for browsers is planned),
* uses [Grunt](http://gruntjs.com), so it does not need Python or Fabric,
* tries to deliver meaningful (mismatch) descriptions, even for arbitrary JavaScript objects,
* lets [Lo-Dash](http://lodash.com) do some of the heavy lifting (because you can't do much better),
* uses deep equivalence (without coercion) as default matcher - instead of '==' or '===',
* uses [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode) for all source and test files,
* has builtin support for [promises](http://promises-aplus.github.io/promises-spec/) using the [Q library](http://documentup.com/kriskowal/q/),
* has an extensive suite of [Mocha](http://visionmedia.github.io/mocha/) tests,
* is still very early in development and not yet ready for use,
* could use some contributors that help with porting the rich set of matchers from the [Java Hamcrest implementation](http://hamcrest.org/JavaHamcrest/).
