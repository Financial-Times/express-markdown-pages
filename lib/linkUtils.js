const path = require('path');
const join = require('url-join');
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
 * Create slug
 * @param {String} filePath
 * @returns {String}
 */
function createSlug(filePath) {
	const { dir, name } = path.parse(filePath);
	const components = dir.split(path.sep).filter(Boolean);

	// Don't include the filename if we're creating a slug for an index page
	if (name !== 'index') {
		components.push(name);
	}

	// Make all slugs absolute unless the path begins with . or ..
	const prefix = /^\.{1,2}$/.test(components[0]) ? '' : '/';

	return `${prefix}${components.map(cleanPathComponent).join('/')}`;
}

/**
 * Safe URL Join
 * This is a HACK to avoid creating URLs with a double slashes in the middle of them:
 * @see https://github.com/jfromaniello/url-join/issues/42
 * @param {String[]} components
 */
function safeUrlJoin(components) {
	const [basePath, ...theRest] = components;
	return join(basePath, ...theRest.filter(component => component !== '/'));
}

module.exports = {
	isInternalLink,
	getNumberPrefix,
	getIndexFromPath,
	cleanPathComponent,
	createSlug,
	safeUrlJoin,
};
