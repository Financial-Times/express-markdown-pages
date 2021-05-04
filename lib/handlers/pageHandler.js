/**
 * @typedef {import('../sharedTypes').Page} Page
 * @typedef {import('../sharedTypes').PageData} PageData
 * @typedef {import('lokijs').Collection<Page>} PagesCollection
 */

const debug = require('../debug');
const { getNavigation } = require('../navigationUtils');
const { getTaxonomies, filterPagesWithParams } = require('../taxonomyUtils');

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Get Page Data
 * @param {import('../MarkdownPages').Options} options
 * @param {PagesCollection} pages
 * @param {String} slug
 * @param {import('qs').ParsedQs} queryParams
 * @returns {PageData|null}
 */
function getPageData(options, pages, slug, queryParams) {
	const page = pages.by('slug', slug);

	if (page) {
		const isIndexPage = /^index\.md$/i.test(page.fileName);

		const navigation = getNavigation(page, pages, isProduction);

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
 * @param {PagesCollection} pages
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */
function pageHandler(options, pages, request, response, next) {
	const pageData = getPageData(options, pages, request.path, request.query);

	debug('Request for page using slug %s', request.path);

	if (pageData) {
		debug('Page found %O', pageData.page);
		response.locals.markdownPages = pageData;
		next();
	} else {
		response.status(404).send('Page not found');
	}
}

module.exports = { getPageData, pageHandler };
