/**
 * Get image data
 * @param {import('lokijs')} db
 * @param {String} slug
 * @returns {import('../createImages').Image}
 */
function getImageData(db, slug) {
	const images = db.getCollection('images');
	return images.by('slug', slug) || undefined;
}

/**
 * Image handler
 * @param {import('lokijs')} db
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */
function imageHandler(db, request, response, next) {
	// NOTE: Use original URL here as the file name could contain unexpected chars
	const imageData = getImageData(db, request.originalUrl);

	if (imageData) {
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
