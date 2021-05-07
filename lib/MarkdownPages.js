/** @module lib/MarkdownPages */

const { createDatabase } = require('./createDatabase');
const { pageHandler } = require('./handlers/pageHandler');
const { imageHandler } = require('./handlers/imageHandler');

/**
 * @typedef Options
 * @property {String} [source="./pages"] - The directory containing your markdown and image content files
 * @property {String} [pathPrefix="/"] - Prepends generated URL paths with this prefix (this should match the route mounted)
 * @property {String[]} [taxonomies=["tags"]] - Frontmatter properties to use as a list of tags used to create logical groupings of content
 */

/**
 * @type {Options}
 * @private
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
	 * Create a new instance of the Markdown pages
	 * @param {Options} userOptions - Client options
	 * @example
	 * const markdownPages = new MarkDownPages({ source: './docs' });
	 */
	constructor(userOptions) {
		/**
		 * @type {Options}
		 * @private
		 */
		this.options = { ...defaultOptions, ...userOptions };

		// Public class properties are supported in Node 12 but they're
		// not actually stable so nothing else likes them, so until then...
		this.middleware = this.middleware.bind(this);
		this.init = this.init.bind(this);
	}

	/**
	 * Middleware
	 * @description An Express compatible route handler which appenda page data to
	 * response.locals or serves image files.
	 * @example
	 * app.get('/docs/*', markdownPages.middleware, (req, res) => {});
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

			if (/\.(png|gif|jpg|svg|webp)$/.test(request.path)) {
				const images = db.getCollection('images');
				return imageHandler(images, request, response, next);
			}

			const pages = db.getCollection('pages');
			return pageHandler(this.options, pages, request, response, next);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Init
	 * @description Initialises the database for your app's pages and images. This is not
	 * required but enables you to store a reference to the database for use in your app.
	 * @example
	 * const db = await markdownPages.init();
	 * const pages = db.getCollection('pages');
	 * const homePage = db.by('slug', '/');
	 * @returns {Promise<import('lokijs')>}
	 */
	init() {
		if (this.db === undefined) {
			this.db = createDatabase(this.options);
		}

		return Promise.resolve(this.db);
	}
}

module.exports = MarkdownPages;
