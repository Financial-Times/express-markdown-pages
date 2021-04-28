const path = require('path');
const pick = require('just-pick');
const { nanoid } = require('nanoid');
const urlJoin = require('proper-url-join');
const frontMatter = require('front-matter');
const debug = require('./debug');
const { getFiles } = require('./fileUtils');
const { getIndexFromPath, createPageSlug } = require('./linkUtils');
const { markdownToHTML, markdownToText } = require('./convertMarkdown');

/**
 * @typedef Page
 * @property {String} filePath - The full path to the file on disk
 * @property {String} fileName - The file base name
 * @property {String} id - A unique randomly generated ID for internal use
 * @property {Number} index - The sort index taken from the file name or parent folder name
 * @property {String} slug - The generated URL path for the page
 * @property {String} html - The transformed HTML content of the page
 * @property {String} text - The transformed text content of the page
 * @property {String[]} childIDs - The IDs of pages one level deeper in the navigation hierarchy
 * @property {String} parentID - The ID of any parent page
 *
 * @property {String} [title] - Title for the page taken from page frontmatter
 * @property {String} [description] - Description for the page taken from page frontmatter
 * @property {String} [cloneContentFrom] - A relative path to another page to clone content from
 * @property {String} [redirect] - A URL or relative path to redirect to instead of displaying the page
 * @property {Boolean} [draft] - Pages set to draft status will be excluded from navigation properties
 */

/**
 * Get page files
 * @param {String} source
 * @returns {Promise<Array<String[]>>}
 */
function getPageFiles(source) {
	const globPattern = path.join(source, '**/*.md');
	debug('Looking for pages in %s', globPattern);
	return getFiles(globPattern);
}

/**
 * Create page from file
 * @param {import('./MarkdownPages').Options} options
 * @param {String} filePath
 * @param {String} fileContent
 * @returns {Page}
 */
function createPageFromFile(options, filePath, fileContent) {
	const { attributes, body } = frontMatter(fileContent);
	// Remove the source directory from the path as we don't need it
	const relativePath = path.relative(options.source, filePath);
	const slug = urlJoin(options.pathPrefix, createPageSlug(relativePath), {
		leadingSlash: true,
	});

	debug('Creating page %O', { filePath, slug });

	return {
		...attributes,
		filePath,
		fileName: path.basename(filePath),
		id: nanoid(),
		index: getIndexFromPath(filePath) || Infinity,
		slug,
		body,
		html: markdownToHTML(body),
		text: markdownToText(body),
	};
}

/**
 * Add relationship data
 * @param {Partial<Page>[]} pages
 * @returns {void}
 */
function addRelationshipData(pages) {
	pages.forEach(page => {
		// This will match slugs which are one level deeper in the path hierarchy
		// NOTE: we use URL join to avoid creating any double slashes (//)
		const slugPattern = urlJoin('^', page.slug, '[^/]+$', {
			leadingSlash: false,
		});
		const childSlug = new RegExp(slugPattern);

		const children = pages.filter(child => childSlug.test(child.slug));

		page.childIDs = [];

		children.forEach(child => {
			page.childIDs.push(child.id);
			child.parentID = page.id;
		});

		debug('Found %d child pages for %s', page.childIDs.length, page.slug);
	});
}

/**
 * Add cloned content
 * @param {Partial<Page>[]} pages
 * @returns {void}
 */
function addClonedContent(pages) {
	pages.forEach(page => {
		if (page.cloneContentFrom) {
			const targetPath = path.join(
				path.dirname(page.filePath),
				page.cloneContentFrom,
			);

			const targetPage = pages.find(
				({ filePath }) => filePath === targetPath,
			);

			debug('Cloning content from %s to %s', page.filePath, targetPath);

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
 * Create pages
 * @param {import('./MarkdownPages').Options} options
 * @returns {Promise<Page[]>}
 */
async function createPages(options) {
	const files = await getPageFiles(options.source);

	debug('Found %d page files', files.length);

	const pages = files.map(file =>
		createPageFromFile(options, file[0], file[1]),
	);

	debug('Created %d pages', pages.length);

	// Append parent/child relationships to each page
	addRelationshipData(pages);

	// Clone content from target pages into placeholder pages
	addClonedContent(pages);

	return pages;
}

module.exports = {
	getPageFiles,
	createPageFromFile,
	addRelationshipData,
	addClonedContent,
	createPages,
};
