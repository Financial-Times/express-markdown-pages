jest.mock('fs/promises');

const fs = require('fs/promises');
const subject = require('../fileUtils');

describe('lib/fileUtils', () => {
	// There is no logic in this method to test
	describe.skip('.findFiles()', () => {});

	// This method composes some
	describe('.loadFiles()', () => {
		const files = ['one.txt', 'two.txt', 'three.txt'];

		describe('when files are loaded successfully', () => {
			beforeEach(() => {
				fs.readFile
					.mockResolvedValueOnce('file one')
					.mockResolvedValueOnce('file two')
					.mockResolvedValueOnce('file three');
			});

			it('tries to load each file', async () => {
				await subject.loadFiles(files);

				files.forEach(file => {
					expect(fs.readFile).toHaveBeenCalledWith(file, 'utf-8');
				});
			});

			it('resolves with all the file contents', () => {
				return expect(subject.loadFiles(files)).resolves.toEqual([
					'file one',
					'file two',
					'file three',
				]);
			});
		});

		describe('when loading files fails', () => {
			beforeEach(() => {
				fs.readFile
					.mockResolvedValueOnce('file one')
					.mockResolvedValueOnce('file two')
					.mockRejectedValueOnce(new Error('Oh no!'));
			});

			it('rejects with the returned error', () => {
				return expect(subject.loadFiles(files)).rejects.toThrowError(
					'Oh no!',
				);
			});
		});
	});

	// This composes the functions above and there is no logic to test
	describe.skip('.getFiles()', () => {});
});
