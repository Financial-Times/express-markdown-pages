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
		.compoundsort(['order', 'fileName', 'title'])
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
 * Filter pages
 * @description Filters out hidden pages and optionally draft pages too
 * @param {Page[]} pages
 * @param {Boolean} excludeDrafts
 * @returns {Page[]}
 */
function filterPages(pages, excludeDrafts) {
	return pages.filter(page => {
		if (excludeDrafts && page.draft === true) {
			return false;
		}

		if (page.hidden === true) {
			return false;
		}

		return true;
	});
}

/**
 * Get navigation
 * @param {Page} page
 * @param {PagesCollection} collection
 * @param {Boolean} [excludeDrafts=false] - Usually set to true in production
 * @returns {Navigation}
 */
function getNavigation(page, collection, excludeDrafts = false) {
	const ancestors = filterPages(
		getAncestors(page, collection),
		excludeDrafts,
	);

	const siblings = filterPages(getSiblings(page, collection), excludeDrafts);

	const children = filterPages(getChildren(page, collection), excludeDrafts);

	return { ancestors, siblings, children, current: page };
}

module.exports = {
	getAncestors,
	getParent,
	getSiblings,
	getChildren,
	getNavigation,
};
