const { getNavigation } = require('../navigationUtils');
const { getTaxonomies, getFilterQueryParams } = require('../taxonomyUtils');

/**
 * Page handler
 * @param {import('../MarkdownPages').Options} options
 * @param {import('lokijs')} db
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */
function pageHandler(options, db, request, response, next) {
	const pages = db.getCollection('pages');

	const page = pages.by('slug', request.path);

	if (page) {
		response.locals.page = page;
		response.locals.navigation = getNavigation(page, pages);

		// TODO: taxonomies and filters
		const queryParams = getFilterQueryParams(
			options.taxonomies,
			request.query,
		);

		// const results = navigation.children.filter(
		// 	child =>
		// 		applyFilter(child.subjects, queryParams.subjects) &&
		// 		applyFilter(child.technologies, queryParams.technologies),
		// );

		response.locals.taxonomies = getTaxonomies(
			options.taxonomies,
			[],
			queryParams,
		);

		next();
	} else {
		response.status(404).send('Page could not be found');
		// Exit the router so we don't call the render handler
		next('route');
	}
}

module.exports = pageHandler;
