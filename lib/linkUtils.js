const path = require('path');
const urlJoin = require('proper-url-join');
const slugify = require('slugify').default;

const IS_ABSOLUTE = /^(http|\/\/)/;

const NUMBER_PREFIX = /^(\d+)\.\s+/;

const INDEX_PAGE = /(\/|^)index$/;

/**
 * Is internal link
 * @description Tests if a link is a relative path between two Markdown files
 * @param {String} href
 * @returns {Boolean}
 */
function isInternalLink(href) {
	return !IS_ABSOLUTE.test(href) && href.endsWith('.md');
}

/**
 * Is internal image
 * @description Tests if a link is a relative path to an image file
 * @param {String} src
 * @returns {Boolean}
 */
function isInternalImage(src) {
	return !IS_ABSOLUTE.test(src) && /\.(png|gif|jpg|svg|webp)$/.test(src);
}

/**
 * Get number prefix
 * @param {String} component
 * @returns {Number|null}
 */
function getNumberPrefix(component) {
	const [, number] = NUMBER_PREFIX.exec(component) || [];
	return number ? parseInt(number, 10) : null;
}

/**
 * Get sort order from path
 * @param {String} filePath
 * @returns {Number|null}
 */
function getSortOrderFromPath(filePath) {
	const { dir, name } = path.parse(filePath);

	if (/^index$/i.test(name)) {
		return getNumberPrefix(path.basename(dir));
	}

	return getNumberPrefix(name);
}

/**
 * Create friendly URL path for a file
 * @description Turns the given file path into a friendly URL
 * @see https://en.wikipedia.org/wiki/Clean_URL
 * @param {String} filePath
 * @returns {String}
 */
function createPathForFile(filePath) {
	const components = filePath.split(/\/|\\/);

	const cleanedComponents = components.map(component => {
		// File and folder names may include a number prefix to specify order
		// but it's not useful in the public URL so remove them.
		const stripped = component.replace(NUMBER_PREFIX, '');
		return slugify(stripped, { lower: true });
	});

	return urlJoin(...cleanedComponents, {
		// We will have lost any / prefix when splitting above
		// so ensure it is reinstated if required.
		leadingSlash: path.isAbsolute(filePath),
	});
}

/**
 * Create friendly URL path for a page
 * @description Creates a file path minus the file extension and indexes
 * @see https://en.wikipedia.org/wiki/Clean_URL
 * @param {String} filePath
 * @returns {String}
 */
function createPathForPage(filePath) {
	const pagePath = createPathForFile(filePath.replace(/\.md$/, ''));

	// If all or the final part of the path is "index" then remove it
	if (INDEX_PAGE.test(pagePath)) {
		return pagePath.replace(INDEX_PAGE, '');
	}

	return pagePath;
}

module.exports = {
	isInternalLink,
	isInternalImage,
	getNumberPrefix,
	getSortOrderFromPath,
	createPathForFile,
	createPathForPage,
};
