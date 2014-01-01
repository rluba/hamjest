Hamjest
=======

A JavaScript implementation of [Hamcrest](http://hamcrest.org).

Unlinke other JS Hamcrest libraries, it

* tries to deliver meaningful and readable (mismatch) descriptions, even for arbitrary JavaScript objects,
* uses deep equivalence (without coercion) as default matcher - instead of '==' or '===',
* has builtin support for [promises](http://promises-aplus.github.io/promises-spec/) using the [Q library](http://documentup.com/kriskowal/q/),
* lets [Lo-Dash](http://lodash.com) do some of the heavy lifting (because you can't do it any better by yourself),
* uses [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode) for all source and test files,
* is designed as a first-class [NPM module](https://npmjs.org) (a build for browsers is planned),
* has an extensive suite of [Mocha](http://visionmedia.github.io/mocha/) tests,
* uses [Grunt](http://gruntjs.com) as build system, so it does not depend on Python or Ruby,
* is still very early in development,
* could use some contributors that help with porting the rich set of matchers from the [Java Hamcrest implementation](http://hamcrest.org/JavaHamcrest/),
* currently lacks documentation, but have a look at the [test suite](./test/) to see lots of usage examples [for each matcher](./test/matchers/) as well as the [assertThat](./test/assertThatSpec.js) and [promiseThat](./test/promiseThatSpec.js) functions.


## License

Licensed under the MIT License [(enclosed)](./LICENSE). 

This library is inspired by and based on the work of the original [Hamcrest team](http://hamcrest.org).

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/rluba/hamjest/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
