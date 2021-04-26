const path = require('path');
const { nanoid } = require('nanoid');
const urlJoin = require('proper-url-join');
const debug = require('./debug');
const { findFiles } = require('./fileUtils');
const { createFileSlug } = require('./linkUtils');

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
	const globPattern = path.join(source, '**/*.{png,gif,jpg,svg,webp}');
	debug('Looking for images in %s', globPattern);
	return findFiles(globPattern);
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
	const slug = urlJoin(options.pathPrefix, createFileSlug(relativePath), {
		leadingSlash: true,
	});

	debug('Creating image %O', { filePath, slug });

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

	debug('Found %d image files', files.length);

	const images = files.map(file => createImageFromFile(options, file));

	debug('Created %d images', images.length);

	return images;
}

module.exports = {
	findImageFiles,
	createImageFromFile,
	createImages,
};
