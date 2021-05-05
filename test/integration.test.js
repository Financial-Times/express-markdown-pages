const supertest = require('supertest');
const createTestApp = require('./helpers/createTestApp');

describe('integration test', () => {
	let app;

	beforeAll(async () => {
		app = await createTestApp();
	});

	it('returns data for the index page', () => {
		return supertest(app)
			.get('/')
			.expect(200)
			.then(response => {
				expect(response.body.page).toEqual(
					expect.objectContaining({
						title: 'Documentation',
						html: expect.any(String),
						text: expect.any(String),
					}),
				);
			});
	});

	it('returns navigation data for the index page', () => {
		return supertest(app)
			.get('/')
			.expect(200)
			.then(response => {
				expect(response.body.navigation).toEqual(
					expect.objectContaining({
						current: expect.objectContaining({
							title: 'Documentation',
						}),
						ancestors: [],
						children: expect.arrayContaining([
							expect.objectContaining({ slug: '/jsdoc' }),
							expect.objectContaining({
								slug: '/writing-content',
							}),
						]),
					}),
				);
			});
	});

	it('returns data for the JSDoc page', () => {
		return supertest(app)
			.get('/jsdoc')
			.expect(200)
			.then(response => {
				expect(response.body.page).toEqual(
					expect.objectContaining({
						html: expect.any(String),
						text: expect.any(String),
					}),
				);
			});
	});

	it('returns navigation data for the JSDoc page', () => {
		return supertest(app)
			.get('/jsdoc')
			.expect(200)
			.then(response => {
				expect(response.body.navigation).toEqual(
					expect.objectContaining({
						current: expect.objectContaining({
							slug: '/jsdoc',
						}),
						ancestors: expect.arrayContaining([
							expect.objectContaining({
								slug: '/',
							}),
						]),
						siblings: expect.arrayContaining([
							expect.objectContaining({
								slug: '/writing-content',
							}),
						]),
					}),
				);
			});
	});

	it('returns data for the writing content page', () => {
		return supertest(app)
			.get('/writing-content')
			.expect(200)
			.then(response => {
				expect(response.body.page).toEqual(
					expect.objectContaining({
						html: expect.any(String),
						text: expect.any(String),
					}),
				);
			});
	});

	it('returns navigation data for the writing content page', () => {
		return supertest(app)
			.get('/writing-content')
			.expect(200)
			.then(response => {
				expect(response.body.navigation).toEqual(
					expect.objectContaining({
						current: expect.objectContaining({
							slug: '/writing-content',
						}),
						ancestors: expect.arrayContaining([
							expect.objectContaining({
								slug: '/',
							}),
						]),
						siblings: expect.arrayContaining([
							expect.objectContaining({
								slug: '/jsdoc',
							}),
						]),
					}),
				);
			});
	});
});
