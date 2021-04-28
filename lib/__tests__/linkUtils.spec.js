const subject = require('../linkUtils');

describe('lib/linkUtils', () => {
	describe('.isInternalLink()', () => {
		it('returns true for relative paths to markdown files', () => {
			expect(subject.isInternalLink('../path/page.md')).toBe(true);
			expect(subject.isInternalLink('./path/page.md')).toBe(true);
			expect(subject.isInternalLink('path/page.md')).toBe(true);
		});

		it('returns false for non-relative paths to markdown files', () => {
			expect(subject.isInternalLink('/path/page.md')).toBe(false);
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
			expect(subject.isInternalImage('path/image.jpg')).toBe(true);
		});

		it('returns false for non-relative paths to image files', () => {
			expect(subject.isInternalImage('/path/image.jpg')).toBe(false);
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

	describe('.cleanPathComponent()', () => {
		it('removes number prefixes', () => {
			expect(subject.cleanPathComponent('1. path')).toBe('path');
			expect(subject.cleanPathComponent('10. path')).toBe('path');
			expect(subject.cleanPathComponent('101. path')).toBe('path');
		});

		it('converts strings to a valid URL', () => {
			expect(subject.cleanPathComponent('I ♥ you?')).toBe('i-love-you');
		});
	});

	describe('.createFileSlug()', () => {
		it('safely transforms the filename including extension', () => {
			expect(subject.createFileSlug('path/to/File Name.jpg')).toMatch(
				/file-name\.jpg$/,
			);
		});

		it('returns an absolute path if given path is absolute', () => {
			expect(subject.createFileSlug('/path/to/File Name.jpg')).toMatch(
				/^\//,
			);
		});

		it('returns a relative path if given path is relative', () => {
			expect(subject.createFileSlug('../path/to/File Name.jpg')).toMatch(
				/^\.\./,
			);
		});
	});

	describe('.createPageSlug()', () => {
		it('does not include the file name when the file name is "index"', () => {
			expect(subject.createPageSlug('path/to/Index.md')).not.toMatch(
				/index/i,
			);
		});

		it('does not remove "index" from file names which include "index"', () => {
			expect(subject.createPageSlug('path/to/not-index.md')).toMatch(
				/not-index/,
			);
		});

		it('returns an absolute path if given path is absolute', () => {
			expect(subject.createPageSlug('/path/to/index.md')).toMatch(/^\//);
		});

		it('returns a relative path if given path is relative', () => {
			expect(subject.createPageSlug('../path/to/index.md')).toMatch(
				/^\.\./,
			);
		});
	});
});
