const debug = require('../debug');

/**
 * Get image data
 * @param {import('lokijs').Collection<import('../createImages.js').Image>} images
 * @param {String} slug
 * @returns {import('../createImages').Image|null}
 */
function getImageData(images, slug) {
	return images.by('slug', slug) || null;
}

/**
 * Image handler
 * @param {import('lokijs').Collection<import('../createImages.js').Image>} images
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */
function imageHandler(images, request, response, next) {
	const imageData = getImageData(images, request.path);

	debug('Request for image using slug %s', request.path);

	if (imageData) {
		debug('Image found %O', imageData);

		const cwd = process.cwd();

		response.sendFile(imageData.filePath, { root: cwd }, error => {
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

module.exports = { getImageData, imageHandler };
