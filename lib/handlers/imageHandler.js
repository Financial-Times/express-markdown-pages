/**
 * Image handler
 * @param {import('lokijs')} db
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */
function imageHandler(db, request, response, next) {
	const images = db.getCollection('images');

	// NOTE: Use original URL here as the file name could contain unexpected chars
	const image = images.by('slug', request.originalUrl);

	if (image === undefined) {
		response.status(404).send('File not found.');

		// This skips any more route handlers in the stack
		next('route');
	} else {
		response.sendFile(image.filePath, { root: process.cwd() }, error => {
			if (error) {
				response.status(500);
				next(error);
			} else {
				response.end();
				next('route');
			}
		});
	}
}

module.exports = imageHandler;
