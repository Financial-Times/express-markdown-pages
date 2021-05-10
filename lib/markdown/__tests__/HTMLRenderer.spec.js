const { HTMLRenderer } = require('../HTMLRenderer');

describe('lib/markdown/HTMLRenderer', () => {
	let renderer;

	beforeEach(() => {
		renderer = new HTMLRenderer();
	});

	describe('.blockquote()', () => {
		// This feature is copied from <https://docup.egoist.sh>
		it('transforms blockquotes with a message type into an o-message block', () => {
			const result = renderer.blockquote('<p>[Warning]: Do this!</p>');

			expect(result).toMatch(/o-message--warning/);
			expect(result).toMatch(/>Do this!</);
		});

		it('does not transform blockquotes without a message type', () => {
			const result = renderer.blockquote('<p>Lorem ipsum</p>');
			expect(result).not.toMatch(/o-message/);
		});
	});

	describe('.code()', () => {
		it('transforms code blocks into an o-syntax-highlight component', () => {
			const result = renderer.code('const foo = "bar";', 'js');
			expect(result).toMatch(/o-syntax-highlight--js/);
		});

		it('escapes code if not already escaped', () => {
			const result = renderer.code('const foo = "bar";', 'js');
			expect(result).toMatch(/const foo = &quot;bar&quot;;/);
		});
	});

	describe('.link()', () => {
		it('transforms local link URLs between Markdown files into page slugs', () => {
			const resultA = renderer.link('../A Page.md');
			expect(resultA).toMatch('href="../a-page"');

			const resultB = renderer.link('./path/to/A Page.md');
			expect(resultB).toMatch('href="./path/to/a-page"');
		});

		it('does not transform external link URLs', () => {
			const resultA = renderer.link('//www.ft.com/A Page.md');
			expect(resultA).toMatch('href="//www.ft.com/A%20Page.md"');

			const resultB = renderer.link('https://www.ft.com');
			expect(resultB).toMatch('href="https://www.ft.com"');
		});
	});

	describe('.image()', () => {
		it('transforms local image URLs into page slugs', () => {
			const resultA = renderer.image('../An Image.jpg');
			expect(resultA).toMatch('src="../an-image.jpg"');

			const resultB = renderer.image('./path/to/An Image.jpg');
			expect(resultB).toMatch('src="./path/to/an-image.jpg"');
		});

		it('does not transform absolute image URLs', () => {
			const resultA = renderer.image('//www.ft.com/An Image.jpg');
			expect(resultA).toMatch('src="//www.ft.com/An%20Image.jpg"');

			const resultB = renderer.image('https://www.ft.com');
			expect(resultB).toMatch('src="https://www.ft.com"');
		});
	});

	describe('.table()', () => {
		it('transforms tables into an o-table component', () => {
			const result = renderer.table('{head}', '{body}');
			expect(result).toMatch(/o-table-container/);
		});

		it('outputs table body tabs only when a body is specified', () => {
			const resultA = renderer.table('{head}', '{body}');
			expect(resultA).toMatch(/<tbody>{body}<\/tbody>/);

			const resultB = renderer.table('{head}');
			expect(resultB).not.toMatch(/<tbody>/);
		});
	});
});
