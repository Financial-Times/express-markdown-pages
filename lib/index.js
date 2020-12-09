const { Router } = require('express');

/**
 * @typedef Options
 * @property {String} [source="./pages"] - The directory containing your markdown and image content files
 * @property {String} [pathPrefix="/"] - Prepends generated URL paths with this prefix (this should match the route mounted)
 * @property {String[]} [taxonomies=["tags"]] - Frontmatter properties to use as a list of tags used to create logical groupings of content
 */

/**
 * @type {Partial<Options>}
 */
const defaultOptions = {
	source: './pages',
	pathPrefix: '/',
	taxonomies: ['tags'],
	//   textRenderer: null, TODO: Support custom markdown to text renderer
	//   htmlRenderer: null, TODO: Support custom markdown to html renderer
};

/**
 * Create an instance of Static Content Stack
 * @param {Options} userOptions - Client options
 * @returns {Router}
 */
function create(userOptions) {
	/**
	 * @type {Options}
	 * @private
	 */
	const options = { ...defaultOptions, ...userOptions };

	console.log(options); // eslint-disable-line no-console

	// const db = createDatabase(options);

	const router = Router();

	// router.get('/search', createSearchHandler(db));

	// router.get('/:file(*.png|gif|jpg|webp|apng)', createStaticFileHandler(db));

	// router.get('/:slug(*)', createPageHandler(db));

	return router;
}

module.exports = { create };
