'use strict';

var _ = require('lodash');
var __ = require('../../lib/hamjest');

describe('typedError', function () {
	it('should match if type and message string match', function () {
		var sut = __.typedError(Error, 'Just a message');

		__.assertThat(sut, __.matches(new Error('Just a message')));
	});

	it('should match if type and message matcher match', function () {
		var sut = __.typedError(Error, __.containsString('Just'));

		__.assertThat(sut, __.matches(new Error('Just another message')));
	});

	_.forEach([
		[undefined, 'was undefined'],
		[null, 'was null'],
		[new Error('Unexpected message'), 'message was "Unexpected message"'],
		[{message: 'Very expected'}, 'type was Object'],
		[{message: 'Unexpected message'}, 'type was Object, message was "Unexpected message"'],
	], function (args) {
		var error = args[0];
		var expectedDescription = args[1];
		it('should not match if type or message do not match: ' + error, function () {
			var sut = __.typedError(Error, __.containsString('Very expected'));

			__.assertThat(sut, __.failsToMatch(error, expectedDescription));
		});
	});

	describe('description', function () {
		it('should contain expected type and message', function () {
			var sut = __.typedError(Error, __.containsString('Very expected'));

			__.assertThat(sut, __.hasDescription('an error of type Error with message a string containing "Very expected"'));
		});
	});
});
