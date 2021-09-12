import * as __ from 'hamjest'

__.assertThat(1, __.equalTo(1));
__.assertThat('Reason', 1, __.equalTo(1));
__.assertThat(1, __.is(1));
__.assertThat(1, __.is(__.equalTo(1)));
__.assertThat(2, __.not(__.equalTo(1)));
__.assertThat(2, __.is(__.not(1)));
__.assertThat(2, __.is(__.not(__.equalTo(1))));
__.assertThat(2, __.is(__.not(__.equalTo(1))));
__.assertThat({one: 1}, {one: 1});
__.assertThat('a reason', {one: 1}, {one: 1});

// Primitives
__.assertThat(true, __.truthy());
__.assertThat(false, __.falsy());
__.assertThat(false, __.falsey());
__.assertThat(false, __.bool());
__.assertThat(false, __.boolean());
__.assertThat(() => null, __.func());
__.assertThat(1, __.number());
__.assertThat({}, __.object());
__.assertThat(/d+/, __.regExp());
__.assertThat('', __.string());
__.assertThat(undefined, __.undef());
__.assertThat(undefined, __.undefined());
__.assertThat(undefined, __.defined());
__.assertThat(new Date(), __.date());
__.assertThat(Date, __.instanceOf(Date));
__.assertThat(false, __.anything());

// Number matcher
__.assertThat(1, __.lessThan(5));
__.assertThat(1, __.lessThanOrEqualTo(5));
__.assertThat(6, __.greaterThan(5));
__.assertThat(6, __.greaterThanOrEqualTo(5));
__.assertThat(1 / 3, __.closeTo(0.33, 0.01));
__.assertThat(1, __.inRange(2));
__.assertThat(1, __.inRange(0, 2));

// String matcher
__.assertThat('hamjest is awesome', __.containsString('is'));
__.assertThat('hamjest is awesome', __.containsStrings('hamjest', 'is'));
__.assertThat('hamjest is awesome', __.startsWith('hamjest'));
__.assertThat('hamjest is awesome', __.endsWith('awesome'));
__.assertThat('hamjest is awesome', __.matchesPattern('is'));
__.assertThat('hamjest is awesome', __.matchesPattern(/.*is.*/));

// Date matcher
__.assertThat(new Date('2015-06-17T14:00:00'), __.after(new Date('2015-06-01T00:00:00')));
__.assertThat(new Date('2015-06-17T14:00:00'), __.afterOrEqualTo(new Date('2015-06-01T00:00:00')));
__.assertThat(new Date('2015-06-01T14:00:00'), __.before(new Date('2015-06-17T00:00:00')));
__.assertThat(new Date('2015-06-01T14:00:00'), __.beforeOrEqualTo(new Date('2015-06-17T00:00:00')));

// Array matcher
__.assertThat([1, 2, 3], __.hasSize(3));
__.assertThat([1, 2, 3], __.hasSize(__.greaterThan(2)));
__.assertThat([], __.isEmpty());
__.assertThat([], __.empty());
__.assertThat([1], __.hasExactlyOneItem(1));
__.assertThat([1], __.array());
__.assertThat([1, 2, 3, 4], __.everyItem(__.number()));
__.assertThat([1, 2, 3, 4], __.hasItem(2));
__.assertThat([1, 2, 3, 4], __.hasItems(2, 3));
__.assertThat([1, 2, 3, 4], __.contains(1, 2, 3));
__.assertThat([1, 2, 3, 4], __.containsInAnyOrder(1, 2, 3));
__.assertThat([1, 2, 3, 4], __.orderedBy((a, b) => a < b));
__.assertThat([1, 2, 3, 4], __.orderedBy((a, b) => a < b, 'ascending'));

// Promise matchers
async function promises() {
	await __.promiseThat(new Promise((resolve) => resolve()), __.promise());
	await __.promiseThat(new Promise((resolve) => resolve()), __.fulfilled());
	await __.promiseThat(new Promise((resolve) => resolve('hamjest')), __.fulfilled(__.string()));
	await __.promiseThat(new Promise((resolve) => resolve()), __.isFulfilledWith());
	await __.promiseThat(new Promise((resolve) => resolve('hamjest')), __.isFulfilledWith(__.string()));
	await __.promiseThat(new Promise((resolve) => resolve('hamjest')), __.willBe(__.string()));
	await __.promiseThat(new Promise((_, reject) => reject()), __.rejected());
	await __.promiseThat(new Promise((_, reject) => reject('hamjest')), __.rejected(__.string()));
	await __.promiseThat(new Promise((_, reject) => reject()), __.isRejectedWith());
	await __.promiseThat(new Promise((_, reject) => reject('hamjest')), __.isRejectedWith(__.string()));
}

// Combinator matcher
__.assertThat('hamjest is awesome', __.allOf(__.string(), __.containsString('hamjest')));
__.assertThat('hamjest is awesome', __.anyOf(__.string(), __.containsString('hamjest')));

// Object matcher
__.assertThat({a: 'A', 0: 0}, __.hasProperties({a: 'A', 0: 0}));
__.assertThat({a: 'A', 0: 0}, __.hasProperty('a', 'A'));
__.assertThat({a: 'A', 0: 0}, __.hasProperty('a'));

// Exception matcher
__.assertThat(() => {throw new Error();}, __.throws());
__.assertThat(() => {throw new Error();}, __.throws(__.instanceOf(Error)));
__.assertThat(() => __.fail(), __.throws());
__.assertThat(() => __.fail('reason'), __.throws());
__.assertThat(() => {throw new RangeError('value out of range');},
	__.throws(__.typedError(RangeError, 'value out of range')));

// Function matcher
__.assertThat(() => 1, __.returns());
__.assertThat(() => 1, __.returns(1));
__.assertThat(() => 1, __.returns(__.number()));

__.assertThat(__.containsString('value'), __.matches('some value'));
__.assertThat(__.containsString('value'), __.hasDescription('a string containing "value"'));
__.assertThat(__.hasSize(5), __.failsToMatch('long string', __.containsString('size was <11>')));

// New Matcher
const matcher = new __.Matcher({
	matches(v: any): boolean {
		return v === true;
	},
	describeTo(description: __.Description): void {
	},
	describeMismatch(v: any, description: __.Description): void {
	},
});
// New TypeSafeMatcher
const tsm = new __.TypeSafeMatcher({
	isExpectedType(v: any): boolean {
		return false;
	},
	matchesSafely(v: boolean): boolean {
		return v === true;
	},
	describeTo(description: __.Description): void {
	},
	describeMismatchSafely(v: boolean, description: __.Description): void {
	},
});
