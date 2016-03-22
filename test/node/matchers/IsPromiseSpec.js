'use strict';

const assert = require('assert');
const Bluebird = require('bluebird');

const __ = require('../../..');

describe('IsPromise', () => {

	describe('promise', () => {
		describe('without argument', () => {
			let sut;
			beforeEach(() => {
				sut = __.promise();
			});

			it('should match fulfilled promises', () => {
				const aFulfilledPromise = Bluebird.resolve('a value');

				assert.ok(sut.matches(aFulfilledPromise));
			});

			it('should match rejected promises', () => {
				const aRejectedPromise = Bluebird.reject(new Error('rejected for a reason'));
				aRejectedPromise.catch(() => null);

				assert.ok(sut.matches(aRejectedPromise));
			});

			it('should match pending promises', () => {
				const aPendingPromise = new Bluebird(() => {});

				assert.ok(sut.matches(aPendingPromise));
			});

			it('should not match values ', () => {
				const aValue = 'a value';

				assert.equal(sut.matches(aValue), false);
			});

			it('should describe nicely', () => {
				const description = new __.Description();

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a promise'));
			});
		});
	});
});
