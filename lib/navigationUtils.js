/**
 * @typedef Navigation
 * @property {import('./createPages').Page[]} ancestors - Pages traversing up the navigation hierarchy from the current page, can be used to render a crumbtrail
 * @property {import('./createPages').Page[]} siblings - Pages at the same level in the navigation hierarchy as the current page
 * @property {import('./createPages').Page[]} children - Any immediate descendants in the navigation hierarchy for the current page
 * @property {import('./createPages').Page} current - A reference to the current page
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
 * Filter out draft pages (in production)
 * @param {import('./createPages').Page[]} page
 * @returns {import('./createPages').Page[]}
 */
function filterOutDraftPages(pages) {
	return pages.filter(
		page => !(process.env.NODE_ENV === 'production' && page.draft === true),
	);
}

/**
 * Get navigation
 * @param {import('./createPages').Page} page
 * @param {import('lokijs').Collection} collection
 * @returns {Navigation}
 */
function getNavigation(page, collection) {
	const ancestors = filterOutDraftPages(getAncestors(page, collection));
	const siblings = filterOutDraftPages(getSiblings(page, collection));
	const children = filterOutDraftPages(getChildren(page, collection));

	return { ancestors, siblings, children, current: page };
}

module.exports = {
	getAncestors,
	getParent,
	getSiblings,
	getChildren,
	getNavigation,
};
