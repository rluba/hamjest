'use strict';

var AssertionError = require('assertion-error')
	, __ = require('../lib/hamjest');


describe('fail', function () {
	it('with a reason: should throw an AssertionError with the reason', function () {
		function assertionErrorWithMessage(matcherOrValue) {
			return __.allOf(
				__.instanceOf(AssertionError),
				new __.FeatureMatcher(matcherOrValue, 'AssertionError with message', 'message')
			);
		}

		__.assertThat(function () {
			__.fail('with a reason');
		}, __.throws(assertionErrorWithMessage('with a reason')));
	});

	it('without a reason: should throw an AssertionError', function () {
		__.assertThat(function () {
			__.fail();
		}, __.throws(__.instanceOf(AssertionError)));
	});

});
