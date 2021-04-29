const fs = require('fs/promises');
const subject = require('../convertMarkdown');

describe('lib/convertMarkdown', () => {
	let fixture;

	beforeAll(async () => {
		fixture = await fs.readFile(
			'./test/fixtures/Page with no frontmatter.md',
			'utf-8',
		);
	});

	describe('.markdownToHTML()', () => {
		it('outputs HTML markup', () => {
			const result = subject.markdownToHTML(fixture);
			expect(result).toMatchSnapshot();
		});
	});

	describe('.markdownToText()', () => {
		it('does not output any HTML markup', () => {
			const result = subject.markdownToText(fixture);

			expect(result).not.toMatch('<');
			expect(result).not.toMatch('>');
		});

		it('does not output any encoded characters', () => {
			const result = subject.markdownToText(fixture);
			expect(result).toMatch('entities & "smart quotes"');
		});
	});
});
