/**
 * @typedef Page
 * @property {String} filePath - The full path to the file on disk
 * @property {String} fileName - The file base name
 * @property {String} id - A unique randomly generated ID for internal use
 * @property {Number} index - The sort index taken from the file or parent folder name
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
 */

/**
 * @typedef Navigation
 * @property {Page[]} ancestors
 * @property {Page[]} siblings
 * @property {Page[]} children
 * @property {Page} current
 */

/**
 * @typedef TaxonomyOption
 * @property {String} name
 * @property {Boolean} selected
 * @property {String} href
 */

/**
 * @typedef Taxonomy
 * @property {String} label
 * @property {String} name
 * @property {TaxonomyOption[]} options
 */

/**
 * @typedef PageData
 * @property {Page} page
 * @property {Navigation} navigation
 * @property {Taxonomy[]|null} taxonomies
 * @property {Page[]|null} results
 */
