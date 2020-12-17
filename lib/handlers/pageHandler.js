const { getNavigation } = require('../navigationUtils');
const { getTaxonomies } = require('../taxonomyUtils');

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

		// const results = navigation.children.filter(
		// 	child =>
		// 		applyFilter(child.subjects, queryParams.subjects) &&
		// 		applyFilter(child.technologies, queryParams.technologies),
		// );

		response.locals.taxonomies = getTaxonomies(
			response.locals.navigation.children,
			options.taxonomies,
			request.query,
		);

		next();
	} else {
		response.status(404).send('Page could not be found');
	}
}

module.exports = pageHandler;
