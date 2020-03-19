import * as _ from 'hamjest'

_.assertThat(1, _.equalTo(1));
_.assertThat('Reason', 1, _.equalTo(1));
_.assertThat(1, _.is(_.equalTo(1)));
_.assertThat(2, _.not(_.equalTo(1)));
_.assertThat(2, _.is(_.not(_.equalTo(1))));
_.assertThat(2, _.is(_.not(_.equalTo(1))));

// Primitives
_.assertThat(true, _.truthy());
_.assertThat(false, _.falsy());
_.assertThat(false, _.falsey());
_.assertThat(false, _.bool());
_.assertThat(false, _.boolean());
_.assertThat(() => {}, _.func());
_.assertThat(1, _.number());
_.assertThat({}, _.object());
_.assertThat(/d+/, _.regExp());
_.assertThat('', _.string());
_.assertThat(undefined, _.undef());
_.assertThat(undefined, _.undefined());
_.assertThat(undefined, _.defined());
_.assertThat(new Date(), _.date());
_.assertThat(Date, _.instanceOf(Date));
_.assertThat(false, _.anything());

// Number matcher
_.assertThat(1, _.lessThan(5));
_.assertThat(1, _.lessThanOrEqualTo(5));
_.assertThat(6, _.greaterThan(5));
_.assertThat(6, _.greaterThanOrEqualTo(5));
_.assertThat(1/3, _.closeTo(0.33, 0.01));;
_.assertThat(1, _.inRange(2));
_.assertThat(1, _.inRange(0, 2));

// String matcher
_.assertThat('hamjest is awesome', _.containsString('is'));
_.assertThat('hamjest is awesome', _.containsStrings('hamjest', 'is'));
_.assertThat('hamjest is awesome', _.startsWith('hamjest'));
_.assertThat('hamjest is awesome', _.endWith('awesome'));
_.assertThat('hamjest is awesome', _.matchesPattern('is'));
_.assertThat('hamjest is awesome', _.matchesPattern(/.*is.*/));

// Date matcher
_.assertThat(new Date('2015-06-17T14:00:00'), _.after(new Date('2015-06-01T00:00:00')));
_.assertThat(new Date('2015-06-17T14:00:00'), _.afterOrEqualTo(new Date('2015-06-01T00:00:00')));
_.assertThat(new Date('2015-06-01T14:00:00'), _.before(new Date('2015-06-17T00:00:00')));
_.assertThat(new Date('2015-06-01T14:00:00'), _.beforeOrEqualTo(new Date('2015-06-17T00:00:00')));

// Array matcher
_.assertThat([1,2,3], _.hasSize(3));
_.assertThat([], _.isEmpty());
_.assertThat([], _.empty());
_.assertThat([1], _.hasExactlyOneItem());
_.assertThat([1], _.array());
_.assertThat([1,2,3,4], _.everyItem(_.number()));
_.assertThat([1,2,3,4], _.hasItem(2));
_.assertThat([1,2,3,4], _.hasItems(2,3));
_.assertThat([1,2,3,4], _.contains(1,2,3));
_.assertThat([1,2,3,4], _.containsInAnyOrder(1,2,3));
_.assertThat([1,2,3,4], _.orderedBy((a, b) => a < b));
_.assertThat([1,2,3,4], _.orderedBy((a, b) => a < b, 'ascending'));

// Promise matchers
_.promiseThat(new Promise((resolve) => { resolve() }), _.promise());
_.promiseThat(new Promise((resolve) => { resolve() }), _.fulfilled());
_.promiseThat(new Promise((resolve) => { resolve('hamjest') }), _.fulfilled(_.string()));
_.promiseThat(new Promise((resolve) => { resolve() }), _.isFulfilledWith());
_.promiseThat(new Promise((resolve) => { resolve('hamjest') }), _.isFulfilledWith(_.string()));
_.promiseThat(new Promise((resolve) => { resolve('hamjest') }), _.willBe(_.string()));
_.promiseThat(new Promise((_, reject) => { reject() }), _.rejected());
_.promiseThat(new Promise((_, reject) => { reject('hamjest') }), _.rejected(_.string()));
_.promiseThat(new Promise((_, reject) => { reject() }), _.isRejectedWith());
_.promiseThat(new Promise((_, reject) => { reject('hamjest') }), _.isRejectedWith(_.string()));
_.promiseThat(new Promise((_, reject) => { reject('hamjest') }), _.promiseAllOf(_.string()));

// Combinator matcher
_.assertThat('hamjest is awesome', _.allOf(_.string(), _.containsString('hamjest')));
_.assertThat('hamjest is awesome', _.anyOf(_.string(), _.containsString('hamjest')));

// Object matcher
_.assertThat({a: 'A', 0: 0}, _.hasProperties({ a: 'A', 0: 0 }));
_.assertThat({a: 'A', 0: 0}, _.hasProperty('a', 'A'));

// Exception matcher
_.assertThat(() => { throw new Error() }, _.throws());
_.assertThat(() => { throw new Error() }, _.throws(_.instanceOf(Error)));
_.assertThat(() => { _.fail() }, _.throws());
_.assertThat(() => { _.fail('reason') }, _.throws());
_.assertThat(() => { throw new RangeError('value out of range') },
  _.throws(_.typedError(RangeError, 'value out of range')));

// Function matcher
_.assertThat(() => { return 1 }, _.returns());
_.assertThat(() => { return 1 }, _.returns(1));
_.assertThat(() => { return 1 }, _.returns(_.number()));

// TODO: unsure if used correctly
_.assertThat(_.containsString('value'), _.matches('some value'));
_. assertThat(_.containsString('value'), _.hasDescription('a string containing "value"'));;
_. assertThat(_.hasSize(5), _.failsToMatch('long string', _.containsString('size was <11>')));;
