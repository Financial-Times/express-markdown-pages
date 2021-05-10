/**
 * @typedef {import('./sharedTypes').Page} Page
 * @typedef {import('./sharedTypes').PageData} PageData
 * @typedef {import('lokijs').Collection<Page>} PagesCollection
 */

const { getNavigation } = require('./navigationUtils');
const { filterPagesWithParams, getTaxonomies } = require('./taxonomyUtils');

// TODO: refactor into hideDrafts option or something
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const INDEX_PAGE = /^index\.md$/i;

/**
 * Get page data
 * @param {Page} page
 * @param {PagesCollection} pages
 * @param {import('./MarkdownPages').Options} options
 * @param {import('qs').ParsedQs} [queryParams={}]
 * @returns {PageData|null}
 */
function getPageData(page, pages, options, queryParams = {}) {
	const isIndexPage = INDEX_PAGE.test(page.fileName);

	const navigation = getNavigation(page, pages, IS_PRODUCTION);

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
