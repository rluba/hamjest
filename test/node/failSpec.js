'use strict';

const AssertionError = require('assertion-error');
const __ = require('../..');

describe('fail', () => {
	it('with a reason: should throw an AssertionError with the reason', () => {
		function assertionErrorWithMessage(valueOrMatcher) {
			return __.allOf(
				__.instanceOf(AssertionError),
				new __.FeatureMatcher(valueOrMatcher, 'AssertionError with message', 'message')
			);
		}

		__.assertThat(() => {
			__.fail('with a reason');
		}, __.throws(assertionErrorWithMessage('with a reason')));
	});

	it('without a reason: should throw an AssertionError', () => {
		__.assertThat(() => {
			__.fail();
		}, __.throws(__.instanceOf(AssertionError)));
	});

});
