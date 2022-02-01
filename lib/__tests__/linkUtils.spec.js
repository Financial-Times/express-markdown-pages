const subject = require('../linkUtils');

describe('lib/linkUtils', () => {
	describe('.isInternalLink()', () => {
		it('returns true for local paths to markdown files', () => {
			expect(subject.isInternalLink('../path/page.md')).toBe(true);
			expect(subject.isInternalLink('./path/page.md')).toBe(true);
			expect(subject.isInternalLink('/path/page.md')).toBe(true);
			expect(subject.isInternalLink('path/page.md')).toBe(true);
		});

		it('returns false for external paths to markdown files', () => {
			expect(subject.isInternalLink('//www.ft.com/path/page.md')).toBe(
				false,
			);
			expect(
				subject.isInternalLink('https://www.ft.com/path/page.md'),
			).toBe(false);
		});

		it('returns false for relative paths to non-markdown files', () => {
			expect(subject.isInternalLink('./path/file.js')).toBe(false);
		});
	});

	describe('.isInternalImage()', () => {
		it('returns true for relative paths to image files', () => {
			expect(subject.isInternalImage('../path/image.jpg')).toBe(true);
			expect(subject.isInternalImage('./path/image.jpg')).toBe(true);
			expect(subject.isInternalImage('/path/image.jpg')).toBe(true);
			expect(subject.isInternalImage('path/image.jpg')).toBe(true);
		});

		it('returns false for external paths to image files', () => {
			expect(subject.isInternalImage('//www.ft.com/path/image.jpg')).toBe(
				false,
			);
			expect(
				subject.isInternalImage('https://www.ft.com/path/image.jpg'),
			).toBe(false);
		});

		it('returns false for relative paths to non-image files', () => {
			expect(subject.isInternalImage('./path/file.js')).toBe(false);
		});
	});

	describe('.getSortOrderFromPath()', () => {
		it('extracts the prefix from the file name', () => {
			expect(
				subject.getSortOrderFromPath('path/to/2. file name.md'),
			).toBe(2);
		});

		it('extracts the prefix from the folder name which the file is named index', () => {
			expect(subject.getSortOrderFromPath('path/2. to/Index.md')).toBe(2);
		});

		it('only extracts the final number', () => {
			expect(
				subject.getSortOrderFromPath('1. path/2. to/3. file name.md'),
			).toBe(3);

			expect(
				subject.getSortOrderFromPath('1. path/2. to/3. the/Index.md'),
			).toBe(3);
		});

		it('returns nothing when a number is not found', () => {
			expect(subject.getSortOrderFromPath('path/to/file.md')).toBeNull();
		});
	});

	describe('.createPathForFile()', () => {
		it('safely transforms the filename including extension', () => {
			expect(subject.createPathForFile('path/to/File Name.jpg')).toBe(
				'path/to/file-name.jpg',
			);
		});

		it('returns an absolute path if given path is absolute', () => {
			expect(subject.createPathForFile('/path/to/File Name.jpg')).toBe(
				'/path/to/file-name.jpg',
			);
		});

		it('returns a relative path if given path is relative', () => {
			expect(subject.createPathForFile('../path/to/File Name.jpg')).toBe(
				'../path/to/file-name.jpg',
			);
		});

		it('removes number prefixes from path components', () => {
			expect(subject.createPathForFile('/path/1. to/here.png')).toBe(
				'/path/to/here.png',
			);

			expect(subject.createPathForFile('/path/to/2. here.png')).toBe(
				'/path/to/here.png',
			);

			expect(
				subject.createPathForFile('/path/1. to/2. here/3. there.png'),
			).toBe('/path/to/here/there.png');
		});

		it('cleans up any double slashes', () => {
			expect(subject.createPathForFile('/path//to/here//there.png')).toBe(
				'/path/to/here/there.png',
			);
		});
	});

	describe('.createPathForPage()', () => {
		it('does not include the file name when the file name is "index"', () => {
			expect(subject.createPathForPage('path/to/Index.md')).not.toMatch(
				/index/i,
			);

			expect(subject.createPathForPage('Index.md')).not.toMatch(/index/i);
		});

		it('does not remove "index" from file names which include "index"', () => {
			expect(subject.createPathForPage('path/to/not-index.md')).toMatch(
				/not-index/,
			);
		});

		it('returns an absolute path if given path is absolute', () => {
			expect(subject.createPathForPage('/path/to/index.md')).toMatch(
				/^\//,
			);
		});

		it('returns a relative path if given path is relative', () => {
			expect(subject.createPathForPage('../path/to/index.md')).toMatch(
				/^\.\./,
			);
		});
	});
});
