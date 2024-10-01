jest.mock('fs/promises');

const fs = require('fs/promises');
const subject = require('../fileUtils');

describe('lib/fileUtils', () => {
	// This only composes two libraries so there is no unit-testable logic
	describe.skip('.findFiles()', () => {});

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
				return expect(subject.loadFiles(files)).rejects.toThrow(
					'Oh no!',
				);
			});
		});
	});

	// This is an imperative composition of the functions above
	// so there is no unit-testable logic.
	describe.skip('.getFiles()', () => {});
});
