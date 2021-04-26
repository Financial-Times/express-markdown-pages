const path = require('path');
const subject = require('../createImages');

describe('lib/createImages', () => {
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

		it('appends a unique ID', () => {
			expect(result.id).toEqual(expect.any(String));
		});

		it('appends the file path and file name', () => {
			expect(result).toMatchObject({
				filePath,
				fileName,
			});
		});

		it('appends a slug with the source path replaced with the path prefix', () => {
			expect(result.slug).toEqual('/url-path/to/My Image.jpg');
		});
	});

	describe.skip('.createImages()', () => {});
});
