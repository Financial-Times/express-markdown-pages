const debug = require('../debug');

/**
 * Image handler
 * @param {import('../sharedTypes').Image} image
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */
function imageHandler(image, request, response, next) {
	debug('Request for image using URL %s', request.path);

	if (image) {
		debug('Image found %O', image);

		const cwd = process.cwd();

		response.sendFile(image.filePath, { root: cwd }, error => {
			if (error) {
				response.status(500);
				next(error);
			} else {
				response.end();
			}
		});
	} else {
		response.status(404).send('File not found.');
	}
}

module.exports = { imageHandler };
