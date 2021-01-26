const path = require('path');
const { nanoid } = require('nanoid');
const { findFiles } = require('./fileUtils');
const { createFileSlug, safeUrlJoin } = require('./linkUtils');

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
	return findFiles(path.join(source, '**/*.{png,gif,jpg,svg,webp}'));
}

/**
 * Create image from file
 * @param {import('./MarkdownPages').Options} options
 * @param {String} filePath
 * @returns {Image}
 */
function createImageFromFile(options, filePath) {
	// Remove the source directory from the path as we don't need it
	const relativePath = path.relative(options.source, filePath);
	const slug = safeUrlJoin(options.pathPrefix, createFileSlug(relativePath));

	return {
		filePath,
		fileName: path.basename(filePath),
		slug,
		id: nanoid(),
	};
}

/**
 * Create images
 * @param {import('./MarkdownPages').Options} options
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
