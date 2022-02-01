/**
 * @private
 * @typedef {import('./sharedTypes').Options} Options
 * @typedef {import('./sharedTypes').Page} Page
 * @typedef {import('./sharedTypes').Image} Image
 * @typedef {import('./sharedTypes').PageData} PageData
 */

const { createDatabase } = require('./createDatabase');
const { getPageData } = require('./getPageData');
const { pageHandler } = require('./handlers/pageHandler');
const { imageHandler } = require('./handlers/imageHandler');

/**
 * @type {Options}
 * @private
 */
const defaultOptions = {
	source: './pages',
	pathPrefix: '/',
	taxonomies: ['tags'],
	hideDraftPages: process.env.NODE_ENV === 'production',
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
	}

	/**
	 * Init
	 * @description Initialises the database for your app's pages and images. This is not
	 * required but enables you to store a reference to the database for use in your app.
	 * @example
	 * const db = await markdownPages.init();
	 * const pages = db.getCollection('pages');
	 * const homePage = db.by('url', '/');
	 * @returns {Promise<import('lokijs')>}
	 */
	async init() {
		if (this.db === undefined) {
			this.db = await createDatabase(this.options);
		}

		return this.db;
	}

	/**
	 * Middleware
	 * @description An Express compatible route handler which appends page data to
	 * response.locals or serves image files.
	 * @example
	 * app.get('/docs/*', markdownPages.middleware, (req, res) => {});
	 * @param {import('express').Request} request
	 * @param {import('express').Response} response
	 * @param {import('express').NextFunction} next
	 * @returns {Promise<void>}
	 */
	async middleware(request, response, next) {
		try {
			const { path, query } = request;

			if (/\.(png|gif|jpg|svg|webp)$/.test(path)) {
				const image = await this.getImage(path);
				imageHandler(image, request, response, next);
			} else {
				const page = await this.getPage(path);
				const pageData = await Promise.resolve(
					page ? this.getPageData(page, query) : null,
				);

				pageHandler(pageData, request, response, next);
			}
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Get page
	 * @description Fetches the content for the page with the given URL.
	 * @example
	 * const aboutPage = markdownPages.getPage('/about-us');
	 * @param {String} url
	 * @returns {Promise<Page|null>}
	 */
	async getPage(url) {
		const db = await this.init();
		const pages = db.getCollection('pages');

		return pages.by('url', url) || null;
	}

	/**
	 * Get image
	 * @description Fetches metadata for an image with the given URL.
	 * @example
	 * const dogImage = markdownPages.getImage('/images/dog.jpg');
	 * @param {String} url
	 * @returns {Promise<Image|null>}
	 */
	async getImage(url) {
		const db = await this.init();
		const images = db.getCollection('images');

		return images.by('url', url) || null;
	}

	/**
	 * Get page data
	 * @description Fetches all data for the given page, including navigation
	 * and taxonomies/results for index pages.
	 * @example
	 * const aboutPage = markdownPages.getPage('/about-us');
	 * const pageData = markdownPages.getDataForPage(aboutPage);
	 * @param {Page} page
	 * @param {import('qs').ParsedQs} [queryParams={}]
	 * @returns {Promise<PageData>}
	 */
	async getPageData(page, queryParams = {}) {
		const db = await this.init();
		const pages = db.getCollection('pages');

		if (page?.id && page?.url) {
			return getPageData(page, pages, this.options, queryParams);
		}

		throw new TypeError('A valid page was not provided');
	}
}

module.exports = MarkdownPages;
