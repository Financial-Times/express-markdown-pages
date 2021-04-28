const fs = require('fs/promises');
const path = require('path');
const subject = require('../convertMarkdown');

const fixturePath = path.join(__dirname, './__fixtures__/No frontmatter.md');

describe('lib/convertMarkdown', () => {
	let fixture;

	beforeAll(async () => {
		fixture = await fs.readFile(fixturePath, 'utf-8');
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
