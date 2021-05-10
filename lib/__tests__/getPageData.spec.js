const createTestDB = require('../../test/helpers/createTestDB');
const subject = require('../getPageData');

describe('lib/getPageData', () => {
	let db;
	let pages;

	const options = {
		taxonomies: ['tags'],
	};

	beforeAll(() => {
		db = createTestDB();
		pages = db.getCollection('pages');
	});

	describe('when getting data for all pages', () => {
		let result;

		beforeAll(() => {
			const aboutPage = pages.by('slug', '/about-us');
			result = subject.getPageData(aboutPage, pages, options, {});
		});

		it('returns the given page', () => {
			expect(result.page).toEqual(
				expect.objectContaining({ slug: '/about-us' }),
			);
		});

		it('returns navigation data for the given page', () => {
			expect(result.navigation).toEqual(
				expect.objectContaining({
					current: expect.objectContaining({ slug: '/about-us' }),
				}),
			);
		});

		it('does not append taxonomy or filtered results data', () => {
			expect(result.taxonomies).toBeNull();
			expect(result.results).toBeNull();
		});
	});

	describe('when getting data for index pages only', () => {
		let result;

		beforeAll(() => {
			const homePage = pages.by('slug', '/');
			result = subject.getPageData(homePage, pages, options, {});
		});

		it('returns navigation data for the given page', () => {
			expect(result.taxonomies).toEqual(expect.any(Array));
			expect(result.results).toEqual(expect.any(Array));
		});
	});
});
