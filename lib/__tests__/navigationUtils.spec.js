const Loki = require('lokijs');
const subject = require('../navigationUtils');

describe('lib/navigationUtils', () => {
	let db;
	let pages;

	beforeAll(() => {
		db = new Loki('test.db');

		// NOTE: I looked into serializing and loading a real DB but it's far
		// more confusing and means the fixture would require regular updates.
		pages = db.addCollection('pages');

		pages.insert([
			{
				title: 'Home',
				id: 'a',
				slug: '/home',
				index: Infinity,
				childIDs: [],
			},
			{
				title: 'About Us',
				id: 'b',
				slug: '/about-us',
				index: 2,
				parentID: 'a',
				childIDs: ['c'],
			},
			{
				title: 'Our People',
				id: 'c',
				slug: '/about-us/our-people',
				index: Infinity,
				parentID: 'b',
				childIDs: ['d', 'e', 'f'],
			},
			{
				title: 'Paige Pollard',
				id: 'd',
				slug: '/about-us/our-people/paige-pollard',
				index: Infinity,
				parentID: 'c',
				childIDs: [],
			},
			{
				title: 'Sneha Howell',
				id: 'e',
				slug: '/about-us/our-people/sneha-howell',
				index: Infinity,
				parentID: 'c',
				childIDs: [],
			},
			{
				title: 'Romeo Schmitt',
				id: 'f',
				slug: '/about-us/our-people/romeo-schmitt',
				index: Infinity,
				parentID: 'c',
				childIDs: [],
			},
			{
				title: 'Services',
				id: 'g',
				slug: '/services',
				index: 1,
				parentID: 'a',
				childIDs: [],
			},
			{
				title: 'Contact Us',
				id: 'h',
				slug: '/contact-us',
				index: 3,
				parentID: 'a',
				childIDs: [],
			},
		]);
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
