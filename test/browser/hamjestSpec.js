(function () {
	'use strict';

	describe('hamjest', () => {
		it('should export itself globally as "hamjest"', () => {

			if (!window.hamjest) {
				throw new Error('Could not find hamjest on the window object');
			}
		});

		it('should export Description', () => {
			const __ = hamjest;

			__.assertThat(__, __.hasProperty('Description'));
		});
	});
}());
