jest.mock('glob');

const glob = require('glob');
const subject = require('../fileUtils');

describe('lib/fileUtils', () => {
	describe('.findFiles()', () => {
		describe('when it finds files successfully', () => {
			beforeEach(() => {
				const mock = jest.fn((pattern, options, callback) =>
					callback(null, ['file.txt']),
				);

				glob.mockImplementationOnce(mock);
			});

			it('resolves with the returned files', () => {
				return expect(subject.findFiles('*.txt')).resolves.toEqual([
					'file.txt',
				]);
			});
		});

		describe('when it fails for any reason', () => {
			beforeEach(() => {
				const mock = jest.fn((pattern, options, callback) =>
					callback(new Error('Oh no!'), null),
				);

				glob.mockImplementationOnce(mock);
			});

			it('rejects with the returned error', () => {
				return expect(subject.findFiles('*.txt')).rejects.toThrowError(
					'Oh no!',
				);
			});
		});
	});

	// This method calls readFile() a few times so there's nothing much to test
	describe.skip('.loadFiles()', () => {});

	describe('.getFiles()', () => {
		beforeAll(() => {
			jest.spyOn(subject, 'findFiles').mockImplementation(jest.fn());
			jest.spyOn(subject, 'loadFiles').mockImplementation(jest.fn());
		});

		afterAll(() => {
			subject.findFiles.mockRestore();
			subject.loadFiles.mockRestore();
		});

		describe('when files are found and loaded successfully', () => {
			beforeEach(() => {
				subject.findFiles.mockResolvedValue([
					'one.md',
					'two.md',
					'three.md',
				]);

				subject.loadFiles.mockResolvedValue([
					'Contents one',
					'Contents two',
					'Contents three',
				]);
			});

			it('resolves with pairs of file names and their contents', () => {
				return expect(subject.getFiles('*.md')).resolves.toEqual([
					['one.md', 'Contents one'],
					['two.md', 'Contents two'],
					['three.md', 'Contents three'],
				]);
			});
		});

		describe('when finding and loading files fails', () => {
			beforeEach(() => {
				subject.findFiles.mockResolvedValue([
					'one.md',
					'two.md',
					'three.md',
				]);

				subject.loadFiles.mockRejectedValue(new Error('Oh no!'));
			});

			it('rejects with the returned error', () => {
				return expect(subject.getFiles('*.txt')).rejects.toThrowError(
					'Oh no!',
				);
			});
		});
	});
});
