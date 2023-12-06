const { glob } = require('glob');
const fs = require('fs/promises');
const throat = require('throat').default;
const zip = require('just-zip-it');

/**
 * Find files
 * @param {String} globPattern
 * @returns {Promise<String[]>}
 */
function findFiles(globPattern) {
	return glob(globPattern);
}

/**
 * Load files
 * @param {String[]} filePaths
 * @returns {Promise<String[]>}
 */
function loadFiles(filePaths = []) {
	const throttle = throat(2);

	const queue = filePaths.map(filePath => {
		return throttle(() => fs.readFile(filePath, 'utf-8'));
	});

	return Promise.all(queue);
}

/**
 * Load stats
 * @param {String[]} filePaths
 * @returns {Promise<import('fs').Stats[]>}
 */
function loadStats(filePaths = []) {
	const throttle = throat(2);

	const queue = filePaths.map(filePath => {
		return throttle(() => fs.stat(filePath));
	});

	return Promise.all(queue);
}

/**
 * Get files
 * @param {String} globPattern
 * @returns {Promise<[string, string, import('fs').Stats][]>}
 */
async function getFiles(globPattern) {
	const files = await findFiles(globPattern);
	const [contents, stats] = await Promise.all([
		loadFiles(files),
		loadStats(files),
	]);

	return zip(files, contents, stats);
}

module.exports = { findFiles, loadFiles, getFiles };
