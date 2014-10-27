All examples expect `hamjest` to be available as `__`.

Many matchers take `valueOrMatcher` as an argument. If you provide a value that is not a matcher, it will be wrapped with `__.equalTo(...)`.

# Builtin matchers
## General matchers

### truthy
Matches [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) values:

	__.assertThat({}, __.is(__.truthy())); // Passes
	__.assertThat(25, __.is(__.truthy())); // Passes

	__.assertThat(undefined, __.is(__.truthy())); // Fails
	__.assertThat('', __.is(__.truthy())); // Fails
	
### falsy
Matches [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) values:

	__.assertThat(null, __.is(__.falsy())); // Passes
	__.assertThat('', __.is(__.falsy())); // Passes

	__.assertThat('Hello', __.is(__.falsy())); // Fails
	__.assertThat(42, __.is(__.falsy())); // Fails


### equalTo(value)
Performs a deep comparison between the given and the tested value. See [_.isEqual](https://lodash.com/docs#isEqual) for for details.

    __.assertThat(25, __.equalTo(25)); // Passes
    __.assertThat(['A', 'B'], __.equalTo(['A', 'B'])); // Passes
    __.assertThat({some: 'value'}, __.equalTo({some: 'value'})); // Passes

    __.assertThat({other: 'value'}, __.equalTo({some: 'value'})); // Fails
    __.assertThat('some value', __.equalTo({some: 'value'})); // Fails
    __.assertThat(25, __.equalTo({some: 'value'})); // Fails

### is(valueOrMatcher)
Syntactic sugar for redable code and error descriptions. It wraps a `valueOrMatcher` and appends "is " to the description.

    __.assertThat({some: 'value'}, __.equalTo({some: 'value'})); // Passes
    __.assertThat({some: 'value'}, __.is(__.equalTo({some: 'value'}))); // Same as above
    __.assertThat({some: 'value'}, __.is({some: 'value'})); // Same as above

## String matchers
TODO

## Number matchers
TODO

## Collection matchers
Collection matchers can be applied to arrays and objects.

### everyItem(valueOrMatcher)
Matches if the given matcher or value matches every item in the collection:

    __.assertThat([1, 2, 3], __.everItem(__.is(__.number()))); // Passes
    __.assertThat({math: 'A', drawing: 'A'}, __.everItem('A'))); // Passes
    __.assertThat({math: 'A', drawing: 'A'}, __.everItem(__.is('A')))); // Same as above

    __.assertThat([1, '2', 3], __.everItem(__.is(__.number()))); // Fails
        

## Array matchers
TODO

## Object matchers
### hasProperty(name, [valueOrMatcher])
Matches if the value has a property with the given name:

    __.assertThat({name: 'jim', age: 25}, __.hasProperty('name')); // Passes

    __.assertThat({firstName: 'jim'}, __.hasProperty('name')); // Fails

You can provide a `valueOrMatcher` to verify the property value:

    __.assertThat({name: 'jim', age: 25}, __.hasProperty('name', 'jim')); // Passes
    __.assertThat({name: 'jim'}, __.hasProperty('name', __.startsWith('j')); // Passes

    __.assertThat({name: 'tom'}, __.hasProperty('name', __.startsWith('j')); // Fails
    
### hasProperties({name: valueOrMatcher, name: valueOrMatcher, ...})
Matches if the value has all specified properties and if their corresponding values match. Additional properties are ignored.

    __.assertThat({name: 'jim', age: 25}, __.hasProperties({name: 'jim',  age: 25})); // Passes
    __.assertThat({name: 'jim', age: 25}, __.hasProperties({name: __.string(), age: __.greaterThan(18)})); // Passes
    __.assertThat({name: 'jim', age: 25, height: 175}, __.hasProperties({name: __.string(), age: __.greaterThan(18)})); // Passes, height is ignored

    __.assertThat({name: 'jim', age: 24}, __.hasProperties({name: 'jim',  age: 25})); // Fails
    __.assertThat({name: 'jim', age: 17}, __.hasProperties({name: __.string(), age: __.greaterThan(18)})); // Fails
    __.assertThat({name: 'jim'}, __.hasProperties({name: __.string(), age: __.greaterThan(18)})); // Fails

Failures provide a detailed description of all properties that did not match.
    
## Function matchers

## throws([matcherOrValue])


Assert that a function throws anything:

    __.assertThat(function () {
    ...
    }, __.throws());

Assert that a function thows a specific type:

    __.assertThat(function () {
    ...
    }, __.throws(__.instanceOf(AssertionError)));

Assert that a function does not throw anything:

    __.assertThat(function () {
    ...
    }, __.not(__.throws()));

## Type matchers

### array()
Assert that a value is an array:

    __.assertThat([], __.is(__.array())); // Passes

    __.assertThat({}, __.is(__.array())); // Fails
    __.assertThat('no array', __.is(__.array())); // Fails

### object()
Assert that a value is an object (see [_.isObject](https://lodash.com/docs#isObject) for what is considered an object):

    __.assertThat({}, __.is(__.object())); // Passes
    __.assertThat([], __.is(__.object())); // Passes
    
    __.assertThat('no object', __.is(__.object())); // Fails
    __.assertThat('41', __.is(__.object())); // Fails

### instanceOf(Type)

Assert that a value is of a certain type:

    __.assertThat(animal, __.is(__.instanceOf(Pony)));
    __.assertThat(error, __.is(__.instanceOf(AssertionError)));
    
## Combining matchers

### allOf(matchers...)
Matches if all given matchers match:

    __.assertThat('an expected value', __.allOf(__.containsString('expected'), __.containsString('value')); // Passes

    __.assertThat('another value', __.allOf(__.containsString('expected'), __.containsString('value')); // Fails

### anyOf(matchers...)
Matches if at least one of the given matchers matches:

    __.assertThat('great value offer', __.anyOf(__.containsString('special'), __.containsString('great value')); // Passes
    __.assertThat('special offer', __.anyOf(__.containsString('special'), __.containsString('great value')); // Passes

    __.assertThat('great offer', __.anyOf(__.containsString('special'), __.containsString('great value')); // Fails


## Promise matchers

### rejected([matcherOrValue]) / isRejectedWith([matcherOrValue])
TODO

### fulfilled([matcherOrValue]) / isFulfilledWith([matcherOrValue]) / willBe([matcherOrValue])

TODO


