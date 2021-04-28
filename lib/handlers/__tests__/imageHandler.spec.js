const requestMock = require('express-request-mock');
const createTestDB = require('../../../test/helpers/createTestDB');
const subject = require('../imageHandler');

describe('lib/handlers/imageHandler', () => {
	const db = createTestDB();
	const images = db.getCollection('images');

	// The handlers expect a collection as the first argument but
	// this test suite will send mock requests directly to it.
	const routeHandler = subject.imageHandler.bind(null, images);

	// The node-mocks-http package does not support response.sendFile()
	// <https://github.com/howardabrams/node-mocks-http/issues/88>
	const mockSendFile = jest.fn((path, options, callback) => callback(null));

	afterEach(() => {
		mockSendFile.mockClear();
	});

	describe('when an image is found', () => {
		it('calls response.sendFile() with the image path', async () => {
			await requestMock(
				routeHandler,
				{ path: '/a-nice-photo.jpg' },
				{ sendFile: mockSendFile },
			);

			expect(mockSendFile).toHaveBeenCalledWith(
				'docs/A nice photo.jpg',
				expect.objectContaining({ root: expect.any(String) }),
				expect.any(Function),
			);
		});

		it('ends the response with a 200', async () => {
			const { response } = await requestMock(
				routeHandler,
				{ path: '/a-nice-photo.jpg' },
				{ sendFile: mockSendFile },
			);

			expect(response.statusCode).toBe(200);
			expect(response._isEndCalled()).toBe(true);
		});
	});

	describe('when an image is not found', () => {
		it('does not call response.sendFile()', async () => {
			await requestMock(
				routeHandler,
				{ path: '/a-non-existant-photo.jpg' },
				{ sendFile: mockSendFile },
			);

			expect(mockSendFile).not.toHaveBeenCalled();
		});

		it('ends the response with a 404', async () => {
			const { response } = await requestMock(
				routeHandler,
				{ path: '/a-non-existant-photo.jpg' },
				{ sendFile: mockSendFile },
			);

			expect(response.statusCode).toBe(404);
			expect(response._isEndCalled()).toBe(true);
		});
	});
});
