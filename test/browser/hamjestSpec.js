(function () {
	'use strict';

	describe('hamjest', function () {
		it('should export itself globally as "hamjest"', function () {

			if (!window.hamjest) {
				throw new Error('Could not find hamjest on the window object');
			}
		});

		it('should export Description', function () {
			var __ = hamjest;

			__.assertThat(__, __.hasProperty('Description'));
		});
	});
}());
