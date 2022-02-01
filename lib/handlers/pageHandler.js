const debug = require('../debug');

/**
 * Page handler
 * @param {import('../sharedTypes').PageData} pageData
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */
function pageHandler(pageData, request, response, next) {
	debug('Request for page using URL %s', request.path);

	if (pageData) {
		debug('Page found %O', pageData.page);

		if (pageData.page.redirect) {
			response.redirect(pageData.page.redirect);
		} else {
			response.locals.markdownPages = pageData;
			next();
		}
	} else {
		response.status(404).send('Page not found');
	}
}

module.exports = { pageHandler };
