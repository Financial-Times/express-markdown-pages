const requestMock = require('express-request-mock');
const createTestDB = require('../../../test/helpers/createTestDB');
const subject = require('../pageHandler');

describe('lib/handlers/pageHandler', () => {
	const db = createTestDB();
	const pages = db.getCollection('pages');

	// This handler expects the options and page collection as the first
	// arguments but this test suite will send mock requests straight to it.
	const routeHandler = subject.pageHandler.bind(null, {}, pages);

	describe('when a page is found', () => {
		describe('and it has a redirect', () => {
			it('redirects to the URL', async () => {
				const { response } = await requestMock(routeHandler, {
					path: '/products',
				});

				expect(response.statusCode).toBe(302);
				expect(response._getRedirectUrl()).toBe('/services');
			});
		});

		describe('and it does not have a redirect', () => {
			it('appends page data to the response locals', async () => {
				const { response } = await requestMock(routeHandler, {
					path: '/about-us/our-people',
				});

				expect(response.locals).toEqual(
					expect.objectContaining({
						markdownPages: expect.objectContaining({
							page: expect.objectContaining({
								title: 'Our People',
							}),
							navigation: expect.objectContaining({
								ancestors: expect.any(Array),
								children: expect.any(Array),
							}),
						}),
					}),
				);
			});
		});
	});

	describe('when a page is not found', () => {
		it('ends the response with a 404', async () => {
			const { response } = await requestMock(routeHandler, {
				path: '/a-non-existant-page',
			});

			expect(response.statusCode).toBe(404);
			expect(response._isEndCalled()).toBe(true);
		});
	});
});
