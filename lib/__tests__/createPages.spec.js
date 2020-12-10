const fs = require('fs');
const path = require('path');
const subject = require('../createPages');

describe('lib/createPages', () => {
	describe.skip('.getPageFiles()', () => {});

	describe('.createPageFromFile()', () => {
		const options = {
			source: './path-on/disk',
			pathPrefix: '/url-path',
		};

		const fileName = '1. Test Page.md';

		const filePath = path.join('./path-on/disk/to', fileName);

		const fileContents = fs.readFileSync(
			'./lib/__tests__/__fixtures__/Test Page.md',
			'utf-8',
		);

		let result;

		beforeAll(() => {
			result = subject.createPageFromFile(
				options,
				filePath,
				fileContents,
			);
		});

		it('appends a unique ID', () => {
			expect(result.id).toEqual(expect.any(String));
		});

		it('appends the file path and file name', () => {
			expect(result).toMatchObject({
				filePath,
				fileName,
			});
		});

		it('appends a slug with the source path replaced with the path prefix', () => {
			expect(result.slug).toEqual('/url-path/to/test-page');
		});

		it('appends the index from the file name', () => {
			expect(result.index).toEqual(expect.any(Number));
		});

		it('appends frontmatter attributes', () => {
			expect(result).toMatchObject({
				title: 'This is the title',
				description: 'This is a description',
			});
		});

		it.skip('appends the body text and HTML', () => {
			expect(result).toMatchObject({
				text: expect.any(String),
				html: expect.any(String),
			});
		});
	});

	describe('.addRelationshipData()', () => {
		const page1 = {
			id: '123',
			slug: 'path',
		};

		const page2 = {
			id: '345',
			slug: 'path/to',
		};

		const page3 = {
			id: '567',
			slug: 'path/to/here',
		};

		const page4 = {
			id: '8910',
			slug: 'path/to/there',
		};

		const pages = [page1, page2, page3, page4];

		beforeAll(() => {
			// WARN: This function mutates and does not return
			subject.addRelationshipData(pages);
		});

		it('appends an array of children to each page', () => {
			pages.forEach(page => {
				expect(Array.isArray(page.childIDs)).toBe(true);
			});
		});

		it('finds children for each page based on their slug', () => {
			expect(page1.childIDs).toEqual([page2.id]);
			expect(page2.childIDs).toEqual([page3.id, page4.id]);
			expect(page3.childIDs).toEqual([]);
			expect(page4.childIDs).toEqual([]);
		});

		it('appends a parent ID to each child', () => {
			expect(page1.parentID).toBeUndefined();
			expect(page2.parentID).toEqual(page1.id);
			expect(page3.parentID).toEqual(page2.id);
			expect(page4.parentID).toEqual(page2.id);
		});
	});

	describe('.addClonedContent()', () => {
		const page1 = {
			filePath: 'path/to/Page 1.md',
			description: 'Description for page 1',
			text: 'Text for page 1',
			html: 'HTML for page 1',
		};

		const page2 = {
			filePath: 'path/to/nested/Page 2.md',
			description: 'Description for page 2',
			text: 'Text for page 2',
			html: 'HTML for page 2',
		};

		const page3 = {
			filePath: 'path/to/elsewhere/Page 3.md',
			cloneContentFrom: '../nested/Page 2.md',
		};

		const pages = [page1, page2, page3];

		beforeAll(() => {
			// WARN: This function mutates and does not return
			subject.addClonedContent(pages);
		});

		it('clones the text, HTML and description from the target page', () => {
			expect(page2.text).toEqual(page3.text);
			expect(page2.html).toEqual(page3.html);
			expect(page2.description).toEqual(page3.description);
		});

		it('throws if the target page cannot be found', () => {
			expect(() => {
				const page = { filePath: 'here', cloneContentFrom: 'there' };
				subject.addClonedContent([page]);
			}).toThrow(/Clone failed/);
		});
	});
});
