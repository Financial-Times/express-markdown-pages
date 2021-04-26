const { getNavigation } = require('../navigationUtils');
const { getTaxonomies, filterPagesWithParams } = require('../taxonomyUtils');

/**
 * @typedef PageData
 * @property {import('../createPages').Page} page
 * @property {import('../navigationUtils').Navigation} navigation
 * @property {import('../taxonomyUtils').Taxonomy[]|null} taxonomies - A list of taxonomies and tags used by any child pages. Only populated for index pages.
 * @property {import('../createPages').Page[]|null} results - A list of child pages filtered by selected tags. Only populated for index pages.
 */

/**
 * Get Page Data
 * @param {import('../MarkdownPages').Options} options
 * @param {import('lokijs').Collection<import('../createPages').Page>} pages
 * @param {String} slug
 * @param {import('qs').ParsedQs} response
 * @returns {PageData|null}
 */
function getPageData(options, pages, slug, queryParams) {
	const page = pages.by('slug', slug);

	if (page) {
		const isIndexPage = /^index\.md$/i.test(page.fileName);

		const navigation = getNavigation(page, pages);

		const results = isIndexPage
			? filterPagesWithParams(
					navigation.children,
					options.taxonomies,
					queryParams,
			  )
			: null;

		const taxonomies = isIndexPage
			? getTaxonomies(
					navigation.children,
					options.taxonomies,
					queryParams,
			  )
			: null;

		return { page, navigation, results, taxonomies };
	}

	return null;
}

/**
 * Page handler
 * @param {import('../MarkdownPages').Options} options
 * @param {import('lokijs').Collection<import('../createPages.js').Page>} pages
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */
function pageHandler(options, pages, request, response, next) {
	const pageData = getPageData(options, pages, request.path, request.query);

	if (pageData) {
		response.locals.markdownPages = pageData;
		next();
	} else {
		response.status(404).send('Page not found');
	}
}

module.exports = { getPageData, pageHandler };
