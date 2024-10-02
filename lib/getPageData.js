/**
 * @typedef {import('./sharedTypes').Page} Page
 * @typedef {import('./sharedTypes').PageData} PageData
 * @typedef {import('lokijs').Collection<Page>} PagesCollection
 */

const { getNavigation } = require('./navigationUtils');
const { filterPagesWithParams, getTaxonomies } = require('./taxonomyUtils');

/**
 * Get page data
 * @param {Page} page
 * @param {PagesCollection} pages
 * @param {import('./MarkdownPages').Options} options
 * @param {import('qs').ParsedQs} [queryParams={}]
 * @returns {PageData|null}
 */
function getPageData(page, pages, options, queryParams = {}) {
	const isIndexPage = /^index\.md$/i.test(page.fileName);

	const navigation = getNavigation(page, pages, options.hideDraftPages);

	const results = isIndexPage
		? filterPagesWithParams(
				navigation.children,
				options.taxonomies,
				queryParams,
			)
		: null;

	const taxonomies = isIndexPage
		? getTaxonomies(navigation.children, options.taxonomies, queryParams)
		: null;

	return { page, navigation, results, taxonomies };
}

module.exports = { getPageData };
