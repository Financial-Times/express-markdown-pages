const { getNavigation } = require('../navigationUtils');
const { getTaxonomies, filterPagesWithParams } = require('../taxonomyUtils');

/**
 * @typedef PageData
 * @property {import('../createPages').Page} page
 * @property {import('../navigationUtils').Navigation} navigation
 * @property {import('../taxonomyUtils').Taxonomy[]} taxonomies
 * @property {import('../createPages').Page[]} results
 */

/**
 * Get Page Data
 * @param {import('../MarkdownPages').Options} options
 * @param {import('lokijs')} db
 * @param {String} slug
 * @param {import('qs').ParsedQs} response
 * @returns {PageData}
 */
function getPageData(options, db, slug, queryParams) {
	const pages = db.getCollection('pages');

	const page = pages.by('slug', slug);

	if (page) {
		const navigation = getNavigation(page, pages);

		const results = filterPagesWithParams(
			navigation.children,
			options.taxonomies,
			queryParams,
		);

		const taxonomies = getTaxonomies(
			navigation.children,
			options.taxonomies,
			queryParams,
		);

		return { page, navigation, results, taxonomies };
	}
}

/**
 * Page handler
 * @param {import('../MarkdownPages').Options} options
 * @param {import('lokijs')} db
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */
function pageHandler(options, db, request, response, next) {
	const pageData = getPageData(options, db, request.path, request.query);

	if (pageData) {
		Object.assign(response.locals, pageData);
		next();
	} else {
		response.status(404).send('Page could not be found');
	}
}

module.exports = { getPageData, pageHandler };
