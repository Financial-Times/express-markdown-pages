const subject = require('../linkUtils');

describe('lib/linkUtils', () => {
	describe('.isInternalLink()', () => {
		it('returns true for relative paths to markdown files', () => {
			expect(subject.isInternalLink('../path/file.md')).toEqual(true);
			expect(subject.isInternalLink('./path/file.md')).toEqual(true);
			expect(subject.isInternalLink('path/file.md')).toEqual(true);
		});

		it('returns false for non-relative paths to markdown files', () => {
			expect(subject.isInternalLink('/path/file.md')).toEqual(false);
			expect(
				subject.isInternalLink('//www.example.com/path/file.md'),
			).toEqual(false);
			expect(
				subject.isInternalLink('https://www.example.com/path/file.md'),
			).toEqual(false);
		});

		it('returns false for relative paths to non-markdown files', () => {
			expect(subject.isInternalLink('/path/file.js')).toEqual(false);
		});
	});

	describe('.cleanPathComponent()', () => {
		it('removes number prefixes', () => {
			expect(subject.cleanPathComponent('1. path')).toEqual('path');
			expect(subject.cleanPathComponent('10. path')).toEqual('path');
			expect(subject.cleanPathComponent('101. path')).toEqual('path');
		});

		it('converts strings to a valid URL', () => {
			expect(subject.cleanPathComponent('I ♥ you?')).toEqual(
				'i-love-you',
			);
		});
	});

	describe('.createSlug()', () => {
		it('does not include the file name when the file name is "index"', () => {
			expect(subject.createSlug('path/to/index.md')).not.toContain(
				'index',
			);
		});

		it('returns an absolute path if given path is not relative', () => {
			expect(subject.createSlug('path/to/index.md')).toMatch(/^\//);
		});

		it('returns a relative path if given path is relative', () => {
			expect(subject.createSlug('../path/to/index.md')).toMatch(/^\.\./);
		});
	});

	describe('.safeUrlJoin()', () => {
		it('concatenates components into a valid URL', () => {
			expect(subject.safeUrlJoin('foo', 'bar', 'baz')).toEqual(
				'foo/bar/baz',
			);
		});

		it('allows a single slash as the first component', () => {
			expect(subject.safeUrlJoin('/', 'foo', 'bar', 'baz')).toEqual(
				'/foo/bar/baz',
			);
		});

		it('filters out single slashes from the remaining components', () => {
			expect(subject.safeUrlJoin('foo', '/', 'bar', '/', 'baz')).toEqual(
				'foo/bar/baz',
			);
		});
	});
});
