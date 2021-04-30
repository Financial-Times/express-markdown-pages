/**
 * @typedef {import('./sharedTypes').Page} Page
 * @typedef {import('./sharedTypes').Navigation} Navigation
 * @typedef {import('lokijs').Collection<Page>} PagesCollection
 */

/**
 * Get parent
 * @param {Page} page
 * @param {PagesCollection} collection
 * @returns {Page | null}
 */
function getParent(page, collection) {
	return page.parentID ? collection.by('id', page.parentID) : null;
}

/**
 * Get ancestors
 * @param {Page} page
 * @param {PagesCollection} collection
 * @returns {Page[]}
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
 * @param {Page} page
 * @param {PagesCollection} collection
 * @returns {Page[]}
 */
function getChildren(page, collection) {
	return collection
		.chain()
		.find({ parentID: page.id })
		.compoundsort(['index', 'fileName', 'title'])
		.data();
}

/**
 * Get siblings
 * @param {Page} page
 * @param {PagesCollection} collection
 * @returns {Page[]}
 */
function getSiblings(page, collection) {
	const parent = getParent(page, collection);
	// We don't filter out the given page because the primary use case for this data
	// is creating tertiary navigation which usually highlights the current page.
	return parent ? getChildren(parent, collection) : [];
}

/**
 * Filter out draft pages (in production)
 * @param {Page[]} pages
 * @returns {Page[]}
 */
function filterOutDraftPages(pages) {
	return pages.filter(
		page => !(process.env.NODE_ENV === 'production' && page.draft === true),
	);
}

/**
 * Get navigation
 * @param {Page} page
 * @param {PagesCollection} collection
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
