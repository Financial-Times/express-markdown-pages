const fs = require('fs/promises');
const path = require('path');
const subject = require('../createPages');

describe('lib/createPages', () => {
	// This only composes two libraries so there is no unit-testable logic
	describe.skip('.getPageFiles()', () => {});

	describe('.createPageURL()', () => {
		it('removes the source directory from the filename', () => {
			expect(
				subject.createPageURL(
					{ source: '/Pages', pathPrefix: '/' },
					'/Pages/Path/File.md',
				),
			).not.toMatch(/pages/i);
		});

		it('prepends with the given prefix', () => {
			expect(
				subject.createPageURL(
					{ source: '/Pages', pathPrefix: '/docs' },
					'/Pages/Path/File.md',
				),
			).toMatch(/^\/docs/i);
		});
		it('always prepends with a leading slash', () => {
			expect(
				subject.createPageURL(
					{ source: '/Pages', pathPrefix: '' },
					'/Pages/Path/File.md',
				),
			).toMatch(/^\//i);
		});

		it('optionally appends with a trailing slash', () => {
			expect(
				subject.createPageURL(
					{ source: '/Pages', pathPrefix: '' },
					'/Pages/Path/File.md',
				),
			).not.toMatch(/\/$/i);

			expect(
				subject.createPageURL(
					{ source: '/Pages', pathPrefix: '' },
					'/Pages/Path/File.md',
					true,
				),
			).toMatch(/\/$/i);
		});
	});

	describe('.createPageFromFile()', () => {
		const options = {
			source: './path/on/disk',
			pathPrefix: '/url-prefix',
		};

		const fileName = '1. Test Page.md';

		const filePath = path.join('./path/on/disk/to', fileName);

		let result;

		beforeAll(async () => {
			const fileContents = await fs.readFile(
				'./test/fixtures/Page.md',
				'utf-8',
			);

			result = subject.createPageFromFile(
				options,
				filePath,
				fileContents,
			);
		});

		it('assigns a unique ID', () => {
			expect(result.id).toEqual(expect.any(String));
		});

		it('assigns the file path and file name', () => {
			expect(result).toMatchObject({
				filePath,
				fileName,
			});
		});

		it('assigns a URL with the source path replaced with the path prefix', () => {
			expect(result.url).toEqual('/url-prefix/to/test-page');
		});

		it('assigns the order from the file name', () => {
			expect(result.order).toEqual(expect.any(Number));
		});

		it('assigns frontmatter attributes', () => {
			expect(result).toMatchObject({
				title: 'Python basics',
				description: 'Python is a nice language',
			});
		});

		it('assigns the body text and HTML', () => {
			expect(result).toMatchObject({
				html: expect.stringContaining('<'),
				text: expect.not.stringContaining('<'),
			});
		});
	});

	describe('.addRelationshipData()', () => {
		const page1 = {
			id: '001',
			url: '/',
		};

		const page2 = {
			id: '002',
			url: '/path',
		};

		const page3 = {
			id: '003',
			url: '/path/here',
		};

		const page4 = {
			id: '004',
			url: '/path/there',
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

		it('finds children for each page based on their URL', () => {
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
			filePath: 'path/to/nested/Page 2.md',
			description: 'Description for page 2',
			text: 'Text for page 2',
			html: 'HTML for page 2',
		};

		const page2 = {
			filePath: 'path/to/elsewhere/Page 3.md',
			cloneContentFrom: '../nested/Page 2.md',
		};

		const pages = [page1, page2];

		beforeAll(() => {
			// WARN: This function mutates and does not return
			subject.addClonedContent(pages);
		});

		it('clones the text, HTML and description from the target page', () => {
			expect(page2.text).toEqual(page1.text);
			expect(page2.html).toEqual(page1.html);
			expect(page2.description).toEqual(page1.description);
		});

		it('throws if the target page cannot be found', () => {
			expect(() => {
				const page = { filePath: 'here', cloneContentFrom: 'there' };
				subject.addClonedContent([page]);
			}).toThrow(/Clone failed/);
		});
	});

	describe('.handleLegacyUrls()', () => {
		const page1 = {
			url: 'to/new/page-1',
			filePath: 'Pages/Page 1.md',
			legacyPaths: ['Pages/old/page.md'],
		};

		const pages = [page1];

		beforeAll(() => {
			// WARN: This function mutates and does not return
			subject.handleLegacyPaths(pages, { source: './Pages' });
		});

		it('creates extra dummy page to redirect from', () => {
			expect(pages.length).toEqual(2);
			expect(pages[0]).toEqual(page1);
			expect(pages[1]).toMatchObject({
				filePath: 'Pages/old/page.md',
				fileName: 'page.md',
				url: '/old/page',
				redirect: page1.url,
			});
		});
	});

	describe('.resolveInternalRedirects()', () => {
		const page1 = {
			url: 'to/new/page-2',
			filePath: 'path/to/new/Page 2.md',
		};

		const page2 = {
			url: 'to/old/page-2',
			filePath: 'path/to/old/Page 2.md',
			redirect: '../new/Page 2.md',
		};

		const pages = [page1, page2];

		beforeAll(() => {
			// WARN: This function mutates and does not return
			subject.resolveInternalRedirects(pages);
		});

		it('replaces original redirect with target page URL', () => {
			expect(page2.redirect).toEqual(page1.url);
		});

		it('throws if the target page cannot be found', () => {
			expect(() => {
				const page = { filePath: 'here', redirect: './there.md' };
				subject.resolveInternalRedirects([page]);
			}).toThrow(/Resolving redirect failed/);
		});
	});

	// This is an imperative composition of the functions above
	// so there is no unit-testable logic.
	describe.skip('.createPages()', () => {});
});
