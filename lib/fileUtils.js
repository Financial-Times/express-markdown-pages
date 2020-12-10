const fs = require('fs');
const glob = require('glob');
const throat = require('throat').default;
const zip = require('just-zip-it');

/**
 * Find files
 * @param {String} globPattern
 * @returns {Promise<String[]>}
 */
function findFiles(globPattern) {
	return new Promise((resolve, reject) => {
		glob(globPattern, {}, (error, files) => {
			if (error) {
				reject(error);
			} else {
				resolve(files);
			}
		});
	});
}

/**
 * Load files
 * @param {String[]} filePaths
 * @returns {Promise<String[]>}
 */
function loadFiles(filePaths = []) {
	const throttle = throat(2);

	const queue = filePaths.map(filePath => {
		return throttle(() => fs.promises.readFile(filePath, 'utf-8'));
	});

	return Promise.all(queue);
}

/**
 * Get files
 * @param {String} globPattern
 * @returns {Promise<Array<String[]>>}
 */
async function getFiles(globPattern) {
	const files = await findFiles(globPattern);
	const contents = await loadFiles(files);

	// zip([a, b, c], [1, 2, 3]) => [[a, 1], [b, 2], [c, 3]]
	return zip(files, contents);
}

module.exports = { findFiles, loadFiles, getFiles };
