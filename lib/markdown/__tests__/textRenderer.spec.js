const { textRenderer } = require('../textRenderer');

describe('lib/markdown/textRenderer', () => {
	describe('.code()', () => {
		it('returns an empty string', () => {
			const result = textRenderer.code('const foo = "bar";', 'js');
			expect(result).toEqual('');
		});
	});

	describe('.link()', () => {
		it('returns link text only', () => {
			const result = textRenderer.link('./Page.md', 'Title', 'Text');
			expect(result).toEqual('Text');
		});
	});

	describe('.image()', () => {
		it('returns image alt text only', () => {
			const result = textRenderer.image('./image.jpg', 'Title', 'Text');
			expect(result).toEqual('Text');
		});
	});

	describe('.table()', () => {
		it('munges the table header and body text', () => {
			const result = textRenderer.table('{head}', '{body}');
			expect(result).toEqual('{head}\n{body}\n');
		});
	});
});
