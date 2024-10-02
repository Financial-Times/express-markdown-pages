const createTestDB = require('../../test/helpers/createTestDB');
const subject = require('../navigationUtils');

describe('lib/navigationUtils', () => {
	let db;
	let pages;

	beforeAll(() => {
		db = createTestDB();
		pages = db.getCollection('pages');
	});

	describe('.getParent()', () => {
		describe('without parent page', () => {
			it('returns null', () => {
				const homePage = pages.by('title', 'Home');
				expect(subject.getParent(homePage, pages)).toBeNull();
			});
		});

		describe('with parent page/s', () => {
			it('returns the parent page', () => {
				const peoplePage = pages.by('title', 'Our People');

				expect(subject.getParent(peoplePage, pages)).toEqual(
					expect.objectContaining({ title: 'About Us' }),
				);
			});
		});
	});

	describe('.getAncestors()', () => {
		describe('without parent page', () => {
			it('returns an empty array', () => {
				const homePage = pages.by('title', 'Home');
				expect(subject.getAncestors(homePage, pages)).toEqual([]);
			});
		});

		describe('with parent page/s', () => {
			it('returns an array of pages starting with the root page', () => {
				const profilePage = pages.by('title', 'Romeo Schmitt');

				expect(subject.getAncestors(profilePage, pages)).toEqual([
					expect.objectContaining({ title: 'Home' }),
					expect.objectContaining({ title: 'About Us' }),
					expect.objectContaining({ title: 'Our People' }),
				]);
			});
		});
	});

	describe('.getChildren()', () => {
		describe('without child page/s', () => {
			it('returns an empty array', () => {
				const servicesPage = pages.by('title', 'Services');
				expect(subject.getChildren(servicesPage, pages)).toEqual([]);
			});
		});

		describe('with child pages', () => {
			it('returns an array of pages sorted by order/file name/title', () => {
				const peoplePage = pages.by('title', 'Our People');

				expect(subject.getChildren(peoplePage, pages)).toEqual([
					expect.objectContaining({ title: 'Paige Pollard' }),
					expect.objectContaining({ title: 'Romeo Schmitt' }),
					expect.objectContaining({ title: 'Sneha Howell' }),
				]);
			});
		});
	});

	describe('.getSiblings()', () => {
		describe('without sibling page/s', () => {
			it('returns an empty array', () => {
				const homePage = pages.by('title', 'Home');
				expect(subject.getSiblings(homePage, pages)).toEqual([]);
			});
		});

		describe('with sibling pages', () => {
			it('returns an array of pages sorted by order/file name/title', () => {
				const aboutPage = pages.by('title', 'About Us');

				expect(subject.getSiblings(aboutPage, pages)).toEqual([
					expect.objectContaining({ title: 'Products', order: null }),
					expect.objectContaining({ title: 'Services', order: 1 }),
					expect.objectContaining({ title: 'About Us', order: 2 }),
					expect.objectContaining({ title: 'Contact Us', order: 3 }),
				]);
			});
		});
	});

	describe('.getNavigation()', () => {
		let homePage;
		let peoplePage;

		beforeAll(() => {
			homePage = pages.by('title', 'Home');
			peoplePage = pages.by('title', 'Our People');
		});

		it('populates properties for a crumbtrail', () => {
			const result = subject.getNavigation(peoplePage, pages);

			expect(result).toEqual(
				expect.objectContaining({
					ancestors: expect.any(Array),
					current: expect.objectContaining({
						title: 'Our People',
					}),
				}),
			);
		});

		it('populates properties for a tertiary navigation', () => {
			const result = subject.getNavigation(peoplePage, pages);

			expect(result).toEqual(
				expect.objectContaining({
					siblings: expect.any(Array),
				}),
			);
		});

		it('populates properties for a sub-navigation', () => {
			const result = subject.getNavigation(peoplePage, pages);

			expect(result).toEqual(
				expect.objectContaining({
					children: expect.any(Array),
				}),
			);
		});

		it('optionally excludes pages marked as a draft', () => {
			const resultA = subject.getNavigation(peoplePage, pages, false);

			expect(resultA.children).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						title: 'Romeo Schmitt',
					}),
				]),
			);

			const resultB = subject.getNavigation(peoplePage, pages, true);

			expect(resultB.children).not.toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						title: 'Romeo Schmitt',
					}),
				]),
			);
		});

		it('excludes pages marked as hidden', () => {
			const result = subject.getNavigation(homePage, pages, false);

			expect(result.children.length).not.toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						title: 'Products',
					}),
				]),
			);
		});
	});
});
