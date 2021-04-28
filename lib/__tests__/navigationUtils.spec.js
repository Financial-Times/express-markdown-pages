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
			it('returns the parent page ', () => {
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
			it('returns an array of pages sorted by index/file name/title', () => {
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
			it('returns an array of pages sorted by index/file name/title', () => {
				const aboutPage = pages.by('title', 'About Us');

				expect(subject.getSiblings(aboutPage, pages)).toEqual([
					expect.objectContaining({ title: 'Services', index: 1 }),
					expect.objectContaining({ title: 'About Us', index: 2 }),
					expect.objectContaining({ title: 'Contact Us', index: 3 }),
				]);
			});
		});
	});

	describe('.getNavigation()', () => {});
});
