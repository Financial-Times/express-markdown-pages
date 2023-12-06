/**
 * @typedef {import('./sharedTypes').Page} Page
 * @typedef {import('./MarkdownPages').Options} Options
 */

const path = require('path');
const pick = require('just-pick');
const { nanoid } = require('nanoid');
const urlJoin = require('proper-url-join');
const frontMatter = require('front-matter');
const debug = require('./debug');
const { getFiles } = require('./fileUtils');
const {
	getSortOrderFromPath,
	createPathForPage,
	isInternalLink,
} = require('./linkUtils');
const { markdownToHTML, markdownToText } = require('./convertMarkdown');

/**
 * Get page files
 * @param {String} source
 * @returns {Promise<[string, string, import('fs').Stats][]>}
 */
function getPageFiles(source) {
	const globPattern = path.join(source, '**/*.md');
	debug('Looking for pages in %s', globPattern);
	return getFiles(globPattern);
}

/**
 * Create page URL
 * @param {Options} options
 * @param {String} filePath
 * @param {Boolean} trailingSlash
 * @returns {String}
 */
function createPageURL(options, filePath, trailingSlash = false) {
	// Remove the source directory from the path as we don't need it
	const relativePath = path.relative(options.source, filePath);

	return urlJoin(options.pathPrefix, createPathForPage(relativePath), {
		leadingSlash: true,
		trailingSlash,
	});
}

/**
 * Create page from file
 * @param {Options} options
 * @param {String} filePath
 * @param {String} fileContent
 * @param {import('fs').Stats} fileStats
 * @returns {Page}
 */
function createPageFromFile(options, filePath, fileContent, fileStats) {
	const fileName = path.basename(filePath);
	const isIndexPage = /^index\.md$/i.test(fileName);
	const url = createPageURL(options, filePath);
	// Index pages don't include the filename in their URL so we append a
	// trailing slash for relative links and images to be resolved correctly
	// within the Markdown content.
	const baseUrl = createPageURL(options, filePath, isIndexPage);
	const { attributes, body } = frontMatter(fileContent);

	debug('Creating page %O', { filePath, url });

	return {
		...attributes,
		createdDate: fileStats?.ctime,
		modifiedDate: fileStats?.mtime,
		filePath,
		fileName,
		id: nanoid(),
		order: getSortOrderFromPath(filePath) || Infinity,
		url,
		body,
		html: markdownToHTML(body, { baseUrl }),
		text: markdownToText(body, { baseUrl }),
	};
}

/**
 * Add relationship data
 * @param {Page[]} pages
 * @returns {void}
 */
function addRelationshipData(pages) {
	pages.forEach(page => {
		// This will match URLs which are one level deeper in the path hierarchy
		// NOTE: we use URL join to avoid creating any double slashes (//)
		const urlPattern = urlJoin('^', page.url, '[^/]+$', {
			leadingSlash: false,
		});
		const isChildURL = new RegExp(urlPattern);

		const children = pages.filter(child => isChildURL.test(child.url));

		page.childIDs = [];

		children.forEach(child => {
			page.childIDs.push(child.id);
			child.parentID = page.id;
		});

		debug('Found %d child pages for %s', page.childIDs.length, page.url);
	});
}

/**
 * Add cloned content
 * @param {Page[]} pages
 * @returns {void}
 */
function addClonedContent(pages) {
	pages.forEach(page => {
		if (page.cloneContentFrom) {
			const targetPath = path.join(
				path.dirname(page.filePath),
				page.cloneContentFrom,
			);

			debug('Cloning content from %s to %s', page.filePath, targetPath);

			const targetPage = pages.find(
				({ filePath }) => filePath === targetPath,
			);

			if (targetPage) {
				const overrides = pick(targetPage, [
					'description',
					'html',
					'text',
				]);

				Object.assign(page, overrides);
			} else {
				throw new Error(
					`Clone failed, ${targetPath} could not be found from ${page.filePath}`,
				);
			}
		}
	});
}

/**
 * Resolve internal redirects
 * @param {Page[]} pages
 * @returns {void}
 */
function handleLegacyPaths(pages, options) {
	const newPages = [];
	pages.forEach(page => {
		if (page.legacyPaths) {
			page.legacyPaths.forEach(filePath => {
				const fileName = path.basename(filePath);
				const url = createPageURL(options, filePath);

				debug('Creating redirect page %O', {
					filePath,
					url,
					redirect: page.url,
				});

				newPages.push({
					filePath,
					fileName,
					id: nanoid(),
					order: Infinity,
					url,
					redirect: page.url,
				});
			});
		}
	});
	pages.push(...newPages);
}

/**
 * Resolve internal redirects
 * @param {Page[]} pages
 * @returns {void}
 */
function resolveInternalRedirects(pages) {
	pages.forEach(page => {
		if (page.redirect && isInternalLink(page.redirect)) {
			const targetPath = path.join(
				path.dirname(page.filePath),
				page.redirect,
			);

			debug(
				'Resolving redirect from %s to %s',
				page.filePath,
				targetPath,
			);

			const targetPage = pages.find(
				({ filePath }) => filePath === targetPath,
			);

			if (targetPage) {
				page.redirect = targetPage.url;
			} else {
				throw new Error(
					`Resolving redirect failed, ${page.redirect} could not be resolved from ${page.filePath}`,
				);
			}
		}
	});
}

/**
 * Create pages
 * @param {Options} options
 * @returns {Promise<Page[]>}
 */
async function createPages(options) {
	const files = await getPageFiles(options.source);

	debug('Found %d page files', files.length);

	const pages = files.map(file =>
		createPageFromFile(options, file[0], file[1], file[2]),
	);

	debug('Created %d pages', pages.length);

	// Append parent/child relationships to each page
	addRelationshipData(pages);

	// Clone content from target pages into placeholder pages
	addClonedContent(pages);

	// ensure entries exist for legacy urls that pages replace
	handleLegacyPaths(pages, options);

	// Resolve and verify internal page redirects
	resolveInternalRedirects(pages);

	return pages;
}

module.exports = {
	getPageFiles,
	createPageURL,
	createPageFromFile,
	addRelationshipData,
	addClonedContent,
	resolveInternalRedirects,
	handleLegacyPaths,
	createPages,
};
