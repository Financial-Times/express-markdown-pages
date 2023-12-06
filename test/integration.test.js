const supertest = require('supertest');
const createTestApp = require('./helpers/createTestApp');

describe('integration test', () => {
	let app;

	beforeAll(async () => {
		app = await createTestApp();
	});

	describe('pages', () => {
		it('responds with data for the index page', () => {
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

		it('responds with navigation data for the index page', () => {
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
								expect.objectContaining({ url: '/jsdoc' }),
								expect.objectContaining({
									url: '/writing-content',
								}),
							]),
						}),
					);
				});
		});

		it('responds with data for the JSDoc page', () => {
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

		it('responds with navigation data for the JSDoc page', () => {
			return supertest(app)
				.get('/jsdoc')
				.expect(200)
				.then(response => {
					expect(response.body.navigation).toEqual(
						expect.objectContaining({
							current: expect.objectContaining({
								url: '/jsdoc',
							}),
							ancestors: expect.arrayContaining([
								expect.objectContaining({
									url: '/',
								}),
							]),
							siblings: expect.arrayContaining([
								expect.objectContaining({
									url: '/writing-content',
								}),
							]),
						}),
					);
				});
		});

		it('responds with data for the Writing Content page', () => {
			return supertest(app)
				.get('/writing-content')
				.expect(200)
				.then(response => {
					expect(response.body.page).toEqual(
						expect.objectContaining({
							createdDate: expect.any(String),
							modifiedDate: expect.any(String),
							html: expect.any(String),
							text: expect.any(String),
						}),
					);
				});
		});

		it('responds with navigation data for the Writing Content page', () => {
			return supertest(app)
				.get('/writing-content')
				.expect(200)
				.then(response => {
					expect(response.body.navigation).toEqual(
						expect.objectContaining({
							current: expect.objectContaining({
								url: '/writing-content',
							}),
							ancestors: expect.arrayContaining([
								expect.objectContaining({
									url: '/',
								}),
							]),
							siblings: expect.arrayContaining([
								expect.objectContaining({
									url: '/jsdoc',
								}),
							]),
						}),
					);
				});
		});

		it('responds with a 404 for an unknown page', () => {
			return supertest(app).get('/unknown').expect(404);
		});
	});

	describe('images', () => {
		it('responds with the request image file', () => {
			return supertest(app)
				.get('/images/github.png')
				.expect(200)
				.expect('Content-Type', /image\/png/);
		});

		it('responds with a 404 for an unknown image', () => {
			return supertest(app).get('/images/unknown.png').expect(404);
		});
	});
});
