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
 * @typedef Image
 * @property {String} filePath - The full path to the file on disk
 * @property {String} fileName - The file base name
 * @property {String} id - A unique randomly generated ID for internal use
 * @property {String} slug - The generated URL path for the page
 */

/**
 * @typedef Navigation
 * @property {Page[]} ancestors - Pages traversing up the navigation hierarchy from the current page, can be used to render a crumbtrail
 * @property {Page[]} siblings - Pages at the same level in the navigation hierarchy as the current page
 * @property {Page[]} children - Any immediate descendants in the navigation hierarchy for the current page
 * @property {Page} current - A reference to the current page
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
 * @property {Taxonomy[]|null} taxonomies - A list of taxonomies and tags used by any child pages. Only populated for index pages.
 * @property {Page[]|null} results - A list of child pages filtered by selected tags. Only populated for index pages.
 */
