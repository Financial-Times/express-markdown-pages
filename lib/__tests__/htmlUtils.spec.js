const subject = require('../htmlUtils');

describe('lib/htmlUtils', () => {
	describe('.escape()', () => {
		it('escapes HTML characters', () => {
			expect(subject.escape('<></>')).toBe('&lt;&gt;&lt;/&gt;');
			expect(subject.escape('"Mac & Cheese"')).toBe(
				'&quot;Mac &amp; Cheese&quot;',
			);
		});
	});
});
