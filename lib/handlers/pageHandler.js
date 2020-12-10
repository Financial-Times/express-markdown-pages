const { getNavigation } = require('../navigationUtils');

/**
 * Page handler
 * @param {import('lokijs').Loki} db
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */
function pageHandler(db, request, response, next) {
	const pages = db.getCollection('pages');

	const page = pages.by('slug', request.path);

	if (page) {
		response.locals.page = page;
		response.locals.navigation = getNavigation(page, pages);
		next();
	} else {
		response.status(404).send('Page could not be found');
		// Exit the router so we don't call the render handler
		next('route');
	}
}

module.exports = pageHandler;
