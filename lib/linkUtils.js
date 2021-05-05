const path = require('path');
const urlJoin = require('proper-url-join');
const slugify = require('slugify').default;

const IS_ABSOLUTE = /^(http|\/)/;

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
 * Get index from path
 * @param {String} filePath
 * @returns {Number|null}
 */
function getIndexFromPath(filePath) {
	const { dir, name } = path.parse(filePath);

	if (/^index$/i.test(name)) {
		return getNumberPrefix(path.basename(dir));
	}

	return getNumberPrefix(name);
}

/**
 * Clean path component
 * @param {String} component
 * @returns {String}
 */
function cleanPathComponent(component) {
	// File and folder names may include a number prefix to specify order
	// but it's not useful in the public URL so remove it.
	const cleaned = component.toLowerCase().replace(NUMBER_PREFIX, '');
	return slugify(cleaned);
}

/**
 * Create file slug
 * @description Turns the given file path into a friendly URL slug
 * @param {String} filePath
 * @returns {String}
 */
function createFileSlug(filePath) {
	const components = filePath.split(/\/|\\/).filter(Boolean);
	const cleanedComponents = components.map(cleanPathComponent);

	return urlJoin(...cleanedComponents, {
		// We will have lost any / prefix when splitting above
		// so ensure it is reinstated if required.
		leadingSlash: path.isAbsolute(filePath),
	});
}

/**
 * Create page slug
 * @description Creates a file slug minus the file extension and indexes
 * @param {String} pagePath
 * @returns {String}
 */
function createPageSlug(pagePath) {
	const slug = createFileSlug(pagePath).replace(/\.md$/, '');

	// If all or the final part of the slug is index then remove it
	if (INDEX_PAGE.test(slug)) {
		return slug.replace(INDEX_PAGE, '');
	}

	return slug;
}

module.exports = {
	isInternalLink,
	isInternalImage,
	getNumberPrefix,
	getIndexFromPath,
	cleanPathComponent,
	createFileSlug,
	createPageSlug,
};
