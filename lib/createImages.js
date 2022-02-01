/**
 * @typedef {import('./sharedTypes').Image} Image
 * @typedef {import('./MarkdownPages').Options} Options
 */

const path = require('path');
const { nanoid } = require('nanoid');
const urlJoin = require('proper-url-join');
const debug = require('./debug');
const { findFiles } = require('./fileUtils');
const { createPathForFile } = require('./linkUtils');

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
 * @param {Options} options
 * @param {String} filePath
 * @returns {Image}
 */
function createImageFromFile(options, filePath) {
	// Remove the source directory from the file path as we don't need it
	const relativePath = path.relative(options.source, filePath);
	const url = urlJoin(options.pathPrefix, createPathForFile(relativePath), {
		leadingSlash: true,
	});

	debug('Creating image %O', { filePath, url });

	return {
		filePath,
		fileName: path.basename(filePath),
		url,
		id: nanoid(),
	};
}

/**
 * Create images
 * @param {Options} options
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
