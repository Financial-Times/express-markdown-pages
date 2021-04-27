const path = require('path');
const urlJoin = require('proper-url-join');
const slugify = require('slugify').default;

const IS_ABSOLUTE = /^(http|\/)/;

const NUMBER_PREFIX = /^(\d+)\.\s+/;

/**
 * Is internal link
 * @description Tests if a link is a relative path between two Markdown files
 * @param {String} href
 * @returns {Boolean}
 */
function isInternalLink(href) {
	return (
		typeof href === 'string' &&
		!IS_ABSOLUTE.test(href) &&
		href.endsWith('.md')
	);
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

	if (name === 'index') {
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
 * Create page slug
 * @description Slugifies the path to a page, creating a friendly URL
 * @param {String} filePath
 * @returns {String}
 */
function createPageSlug(filePath) {
	const { dir, name } = path.parse(filePath);
	const components = dir.split(path.sep).filter(Boolean);

	// Don't include the filename if we're creating a slug for an index page
	if (/^index$/i.test(name) === false) {
		components.push(name);
	}

	const cleanedComponents = components.map(cleanPathComponent);

	return urlJoin(...cleanedComponents, {
		// We will have lost the / prefix when splitting above.
		leadingSlash: path.isAbsolute(filePath),
	});
}

/**
 * Create file slug
 * @description Slugifies the path to a binary file, preserving original file name
 * @param {String} filePath
 * @returns {String}
 */
function createFileSlug(filePath) {
	const components = filePath.split(path.sep).filter(Boolean);
	const cleanedComponents = components.map(cleanPathComponent);

	// We don't slugify the file name as this should not be transformed

	return urlJoin(...cleanedComponents, {
		// We will have lost the / prefix when splitting above.
		leadingSlash: path.isAbsolute(filePath),
	});
}

module.exports = {
	isInternalLink,
	getNumberPrefix,
	getIndexFromPath,
	cleanPathComponent,
	createPageSlug,
	createFileSlug,
};
