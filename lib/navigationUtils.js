/**
 * @typedef Navigation
 * @property {import('./createPages').Page[]} ancestors
 * @property {import('./createPages').Page[]} siblings
 * @property {import('./createPages').Page[]} children
 * @property {import('./createPages').Page} current
 */

/**
 * Get parent
 * @param {import('./createPages').Page} page
 * @param {import('lokijs').Collection} collection
 * @returns {import('./createPages').Page | null}
 */
function getParent(page, collection) {
	return page.parentID ? collection.by('id', page.parentID) : null;
}

/**
 * Get ancestors
 * @param {import('./createPages').Page} page
 * @param {import('lokijs').Collection} collection
 * @returns {import('./createPages').Page[]}
 */
function getAncestors(page, collection) {
	const ancestors = [];

	while (page) {
		page = getParent(page, collection);

		// The most distant ancestor will be first and the parent last
		if (page) {
			ancestors.unshift(page);
		}
	}

	return ancestors;
}

/**
 * Get children
 * @param {import('./createPages').Page} page
 * @param {import('lokijs').Collection} collection
 * @returns {import('./createPages').Page[]}
 */
function getChildren(page, collection) {
	return collection
		.chain()
		.find({ parentID: page.id })
		.compoundsort(['index', 'fileName'])
		.data();
}

/**
 * Get siblings
 * @param {import('./createPages').Page} page
 * @param {import('lokijs').Collection} collection
 * @returns {import('./createPages').Page[]}
 */
function getSiblings(page, collection) {
	const parent = getParent(page, collection);
	return parent ? getChildren(parent, collection) : [];
}

/**
 * Get navigation
 * @param {import('./createPages').Page} page
 * @param {import('lokijs').Collection} collection
 * @returns {Navigation}
 */
function getNavigation(page, collection) {
	const ancestors = getAncestors(page, collection);
	const siblings = getSiblings(page, collection);
	const children = getChildren(page, collection);

	return { ancestors, siblings, children, current: page };
}

module.exports = {
	getAncestors,
	getParent,
	getSiblings,
	getChildren,
	getNavigation,
};
