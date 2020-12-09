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

class MarkdownPages {
	/**
	 * Create an instance of Static Content Stack
	 * @param {Options} userOptions - Client options
	 */
	constructor(userOptions) {
		/**
		 * @type {Options}
		 * @private
		 */
		this.options = { ...defaultOptions, ...userOptions };
	}

	/**
	 * Middleware
	 * @param {import('express').Request} request
	 * @param {import('express').Response} response
	 * @param {import('express').NextFunction} next
	 * @returns void
	 */
	middleware(request, response, next) {
		// This would be easier by creating a new Express router _but_ doing so
		// would make mounting this middleware and the interface for providing
		// a custom handler to render the output absolutely horrible.
		// router.get('/search', createSearchHandler(db));
		// router.get('/:file(*.png|gif|jpg|webp|apng)', createStaticFileHandler(db));
		// router.get('/:slug(*)', createPageHandler(db));

		console.log(request.path);
		next();
	}

	/**
	 * Init
	 * @returns Promise<void>
	 */
	init() {
		// this.db = createDatabase(this.options);
		return Promise.resolve();
	}
}

module.exports = { MarkdownPages };
