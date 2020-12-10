const { createDatabase } = require('./createDatabase');

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

		// Public class properties are supported in Node 12 but they're
		// not actually stable so nothing else likes them, until then...
		this.middleware = this.middleware.bind(this);
		this.init = this.init.bind(this);
	}

	/**
	 * Middleware
	 * @param {import('express').Request} request
	 * @param {import('express').Response} response
	 * @param {import('express').NextFunction} next
	 * @returns {Promise<void>}
	 */
	async middleware(request, response, next) {
		// This would be easier by creating a new Express router _but_ doing so
		// would make mounting this middleware and the interface for providing
		// a custom handler to render the output absolutely horrible.

		try {
			const db = await this.init();

			if (/\.(png|gif|jpg|webp)$/.test(request.path)) {
				// return staticFileHandler(this.options, db, request, response, next);
			}

			if (request.params.search) {
				// return searchPageHandler(this.options, db, request, response, next);
			}

			// return staticPageHandler(this.options, db, request, response, next);

			const pages = db.getCollection('pages');

			const page = pages.by('slug', request.path);

			if (page) {
				response.locals.page = page;

				next();
			} else {
				response.status(404).send('Page could not be found');
				// Exit the router so we don't call the render handler
				next('route');
			}
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Init
	 * @returns {Promise<void>}
	 */
	init() {
		if (this.db === undefined) {
			this.db = createDatabase(this.options);
		}

		return Promise.resolve(this.db);
	}
}

module.exports = { MarkdownPages };
