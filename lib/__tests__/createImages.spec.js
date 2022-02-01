const path = require('path');
const subject = require('../createImages');

describe('lib/createImages', () => {
	// This only composes two libraries so there is no unit-testable logic
	describe.skip('.findImageFiles()', () => {});

	describe('.createImageFromFile()', () => {
		const options = {
			source: './path-on/disk',
			pathPrefix: '/url-path',
		};

		const fileName = 'My Image.jpg';

		const filePath = path.join('./path-on/disk/to', fileName);

		let result;

		beforeAll(() => {
			result = subject.createImageFromFile(options, filePath);
		});

		it('assigns a unique ID', () => {
			expect(result.id).toEqual(expect.any(String));
		});

		it('assigns the file path and file name', () => {
			expect(result).toMatchObject({
				filePath,
				fileName,
			});
		});

		it('assigns a URL with the source path replaced with the path prefix', () => {
			expect(result.url).toEqual('/url-path/to/my-image.jpg');
		});
	});

	// This is an imperative composition of the functions above
	// so there is no unit-testable logic.
	describe.skip('.createImages()', () => {});
});
