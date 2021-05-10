/**
 * @module lib/MarkdownPages
 *
 * @typedef {import('./sharedTypes').PageData} PageData
 * @typedef {import('./sharedTypes').Image} Image
 */

const { createDatabase } = require('./createDatabase');
const { getPageData } = require('./getPageData');
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
			if (/\.(png|gif|jpg|svg|webp)$/.test(request.path)) {
				const image = await this.getImage(request.path);
				imageHandler(image, request, response, next);
			} else {
				const pageData = await this.getPageData(
					request.path,
					request.query,
				);

				pageHandler(pageData, request, response, next);
			}
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Get page data
	 * @description Fetches all page data for the given slug, including navigation
	 * and taxonomies/results for index pages.
	 * @example
	 * const pageData = markdownPages.getPageData('/about')
	 * @param {String} slug
	 * @param {import('qs').ParsedQs} [queryParams={}]
	 * @returns {Promise<PageData|null>}
	 */
	async getPageData(slug, queryParams = {}) {
		const db = await this.init();
		const pages = db.getCollection('pages');
		const page = pages.by('slug', slug);

		return page
			? getPageData(page, pages, this.options, queryParams)
			: null;
	}

	/**
	 * Get image
	 * @description Fetches metadata for an image with the given slug.
	 * @example
	 * const imageData = markdownPages.getImageData('/images/dog.jpg')
	 * @param {String} slug
	 * @returns {Promise<Image|null>}
	 */
	async getImage(slug) {
		const db = await this.init();
		const images = db.getCollection('images');

		return images.by('slug', slug) || null;
	}
}

module.exports = MarkdownPages;
