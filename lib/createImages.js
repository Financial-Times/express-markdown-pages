const path = require('path');
const { nanoid } = require('nanoid');
const { findFiles } = require('./fileUtils');
const { createSlug, safeUrlJoin } = require('./linkUtils');

/**
 * @typedef Image
 * @property {String} filePath - The full path to the file on disk
 * @property {String} fileName - The file base name
 * @property {String} id - A unique randomly generated ID for internal use
 * @property {String} slug - The generated URL path for the page
 */

/**
 * Get image files
 * @param {String} source
 * @returns {Promise<String[]>}
 */
function findImageFiles(source) {
	return findFiles(path.join(source, '**/*.{png,gif,jpg,webp}'));
}

/**
 * Create image from file
 * @param {import('./').Options} options
 * @param {String} filePath
 * @returns {Image}
 */
function createImageFromFile(options, filePath) {
	// Don't slugify the file name as this should not be transformed
	const fileName = path.basename(filePath);
	const dirName = path.dirname(filePath);
	// Remove the source directory from the path as we don't need it
	const relativePath = path.relative(options.source, dirName);
	const slug = safeUrlJoin([
		options.pathPrefix,
		createSlug(relativePath),
		fileName,
	]);

	return {
		filePath,
		fileName,
		slug,
		id: nanoid(),
	};
}

/**
 * Create images
 * @param {import('./').Options} options
 * @returns {Promise<Image[]>}
 */
async function createImages(options) {
	const files = await findImageFiles(options.source);
	return files.map(file => createImageFromFile(options, file));
}

module.exports = {
	findImageFiles,
	createImageFromFile,
	createImages,
};
