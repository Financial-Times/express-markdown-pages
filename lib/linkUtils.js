const path = require('path');
const slugify = require('slugify').default;

const NUMBER_PREFIX = /^(\d+)\.\s+/;

/**
 * Is internal link
 * @param {String} href
 * @returns {Boolean}
 */
function isInternalLink(href) {
	return (
		typeof href === 'string' && href.startsWith('.') && href.endsWith('.md')
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

module.exports = {
	isInternalLink,
	getNumberPrefix,
	getIndexFromPath,
	cleanPathComponent,
	createSlug,
};