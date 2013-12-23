hamjest
=======

A JavaScript implementation of [Hamcrest](http://hamcrest.org).

Unlinke [JsHamcrest](https://github.com/danielfm/jshamcrest) it

* is designed as a first-class NPM module (with a planned build for browsers)
* does not require Python or Fabric because it uses [Grunt](http://gruntjs.com)
* tries to deliver meaningful (mismatch) descriptions, even for arbitrary JavaScript objects
* uses [Lo-Dash](http://lodash.com) for the heavy lifting (because you can't do much better)
* has builtin support for [promises](http://promises-aplus.github.io/promises-spec/) using the [Q library](http://documentup.com/kriskowal/q/)
* is still very early in development and could use some contributors that help with porting the rich set of matchers from the [Java Hamcrest implementation](http://hamcrest.org/JavaHamcrest/)