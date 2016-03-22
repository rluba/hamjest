'use strict';

const Bluebird = require('bluebird');

const __ = require('../../..');
const assertTrue = require('../asserts').assertTrue;
const assertFalse = require('../asserts').assertFalse;

describe('IsPromise', () => {

	describe('promise', () => {
		describe('without argument', () => {
			let sut;
			beforeEach(() => {
				sut = __.promise();
			});

			it('should match fulfilled promises', () => {
				const aFulfilledPromise = Bluebird.resolve('a value');

				assertTrue(sut.matches(aFulfilledPromise));
			});

			it('should match rejected promises', () => {
				const aRejectedPromise = Bluebird.reject(new Error('rejected for a reason'));
				aRejectedPromise.catch(() => null);

				assertTrue(sut.matches(aRejectedPromise));
			});

			it('should match pending promises', () => {
				const aPendingPromise = new Bluebird(() => {});

				assertTrue(sut.matches(aPendingPromise));
			});

			it('should not match values ', () => {
				const aValue = 'a value';

				assertFalse(sut.matches(aValue));
			});

			it('should describe nicely', () => {
				const description = new __.Description();

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a promise'));
			});
		});
	});
});
