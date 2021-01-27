const subject = require('../taxonomyUtils');

describe('lib/taxonomyUtils', () => {
	const page1 = {
		categories: ['reviews'],
		subjects: ['technology'],
	};

	const page2 = {
		categories: ['updates', 'news'],
		subjects: ['education', 'technology'],
	};

	const page3 = {
		categories: ['news'],
	};

	const pages = [page1, page2, page3];

	describe('.getTagsFromPage()', () => {
		it('returns an array of tags for given taxonomy', () => {
			expect(subject.getTagsFromPage(page1, 'subjects')).toEqual(
				page1.subjects,
			);
		});

		it('returns an array even when the taxonomy does not exist', () => {
			expect(subject.getTagsFromPage(page3, 'subjects')).toEqual([]);
		});
	});

	describe('.getTagsFromPages()', () => {
		it('returns an array of tags for given taxonomy', () => {
			subject.getTagsFromPages(pages, 'categories').forEach(item => {
				expect(item).toEqual(expect.any(String));
			});
		});

		it('de-duplicates tags', () => {
			expect(
				subject.getTagsFromPages(pages, 'categories').length,
			).toEqual(3);
		});

		it('sorts tags alphanumerically', () => {
			expect(subject.getTagsFromPages(pages, 'categories')).toEqual([
				'news',
				'reviews',
				'updates',
			]);
		});
	});

	describe('.createFilterQueryString()', () => {
		it('uses a nested namespace for filters', () => {
			const result = subject.createFilterQueryString(
				'news',
				'categories',
				false,
				{ other: 'params' },
			);

			expect(result).toEqual(
				'?other=params&filters%5Bcategories%5D=news',
			);
		});

		it('preserves any existing filters', () => {
			const result = subject.createFilterQueryString(
				'news',
				'categories',
				false,
				{ filters: { subjects: 'education' } },
			);

			expect(result).toEqual(
				'?filters%5Bsubjects%5D=education&filters%5Bcategories%5D=news',
			);
		});

		it('toggles the given filter off when it is already selected', () => {
			const result = subject.createFilterQueryString(
				'news',
				'categories',
				true,
				{ filters: { subjects: 'education' } },
			);

			expect(result).toEqual('?filters%5Bsubjects%5D=education');
		});
	});

	describe('.filterPagesWithParams()', () => {
		it('returns all pages when no filters are given', () => {
			const result = subject.filterPagesWithParams(
				pages,
				['categories', 'subjects'],
				{},
			);

			expect(result.length).toBe(pages.length);
		});

		it('returns pages which are tagged with a given filters', () => {
			const result = subject.filterPagesWithParams(
				pages,
				['categories', 'subjects'],
				{
					filters: {
						subjects: 'technology',
					},
				},
			);

			expect(result.length).toBe(2);
		});

		it('returns pages which are tagged with all the given filters', () => {
			const result = subject.filterPagesWithParams(
				pages,
				['categories', 'subjects'],
				{
					filters: {
						categories: 'news',
						subjects: 'education',
					},
				},
			);

			expect(result.length).toBe(1);
		});
	});

	describe('.createTaxonomyOptions()', () => {
		const tags = ['education', 'technology'];

		it('returns an array of taxonomy option objects', () => {
			const result = subject.createTaxonomyOptions(tags, 'subjects', {});

			expect(result.length).toEqual(tags.length);

			result.forEach(item => {
				expect(item).toEqual(
					expect.objectContaining({
						name: expect.any(String),
						href: expect.any(String),
						selected: expect.any(Boolean),
					}),
				);
			});
		});
	});

	describe('.getTaxonomies()', () => {
		it('returns an array of taxonomy objects', () => {
			const result = subject.getTaxonomies(
				pages,
				['subjects', 'categories'],
				{},
			);

			expect(result.length).toEqual(2);

			result.forEach(item => {
				expect(item).toEqual(
					expect.objectContaining({
						name: expect.any(String),
						label: expect.any(String),
						options: expect.any(Array),
					}),
				);
			});
		});

		it('adds a singular label for each taxonomy', () => {
			const result = subject.getTaxonomies(
				pages,
				['subjects', 'categories'],
				{},
			);

			const a = result.find(item => item.name === 'subjects');
			const b = result.find(item => item.name === 'categories');

			expect(a.label).toEqual('subject');
			expect(b.label).toEqual('category');
		});
	});
});
