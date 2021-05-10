const requestMock = require('express-request-mock');
const createTestDB = require('../../../test/helpers/createTestDB');
const subject = require('../pageHandler');

describe('lib/handlers/pageHandler', () => {
	const db = createTestDB();
	const pages = db.getCollection('pages');

	describe('when a page is found', () => {
		describe('and it has a redirect', () => {
			let routeHandler;

			beforeAll(() => {
				const page = pages.by('slug', '/products');
				// This handler expects the page as the first argument but
				// this test suite will send mock requests directly to it.
				routeHandler = subject.pageHandler.bind(null, { page });
			});

			it('redirects to the URL', async () => {
				const { response } = await requestMock(routeHandler);

				expect(response.statusCode).toBe(302);
				expect(response._getRedirectUrl()).toBe('/services');
			});
		});

		describe('and it does not have a redirect', () => {
			let routeHandler;

			beforeAll(() => {
				const page = pages.by('slug', '/about-us/our-people');
				// This handler expects the page as the first argument but
				// this test suite will send mock requests directly to it.
				routeHandler = subject.pageHandler.bind(null, { page });
			});

			it('appends given page data to the response locals', async () => {
				const { response } = await requestMock(routeHandler);

				expect(response.locals).toEqual(
					expect.objectContaining({
						markdownPages: expect.objectContaining({
							page: expect.objectContaining({
								title: 'Our People',
							}),
						}),
					}),
				);
			});
		});
	});

	describe('when a page is not found', () => {
		let routeHandler;

		beforeAll(() => {
			const page = pages.by('slug', '/a-non-existant-page');
			// This handler expects the page as the first argument but
			// this test suite will send mock requests directly to it.
			routeHandler = subject.pageHandler.bind(null, page);
		});

		it('ends the response with a 404', async () => {
			const { response } = await requestMock(routeHandler);

			expect(response.statusCode).toBe(404);
			expect(response._isEndCalled()).toBe(true);
		});
	});
});
