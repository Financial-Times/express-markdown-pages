const { TextRenderer } = require('../TextRenderer');

describe('lib/markdown/textRenderer', () => {
	let renderer;

	beforeEach(() => {
		renderer = new TextRenderer();
	});

	describe('.code()', () => {
		it('returns an empty string', () => {
			const result = renderer.code('const foo = "bar";', 'js');
			expect(result).toEqual('');
		});
	});

	describe('.link()', () => {
		it('returns link text only', () => {
			const result = renderer.link('./Page.md', 'Title', 'Text');
			expect(result).toEqual('Text');
		});
	});

	describe('.image()', () => {
		it('returns image alt text only', () => {
			const result = renderer.image('./image.jpg', 'Title', 'Text');
			expect(result).toEqual('Text');
		});
	});

	describe('.table()', () => {
		it('munges the table header and body text', () => {
			const result = renderer.table('{head}', '{body}');
			expect(result).toEqual('{head}\n{body}\n');
		});
	});
});
