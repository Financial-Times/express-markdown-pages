/**
 * JSDoc and VSCode support different formats for importing types from modules
 * so generating docs whilst maintaining support in our editors is not possible.
 *
 * There are plugins for JSDoc but I couldn't find any that supported the range
 * of syntax VSCode does. I also tried out TSDoc, Better Docs, Typedoc etc. but
 * none support the JSDoc/TS mashup grammar that VSCode does, e.g.:
 *
 * {Promise<InstanceType<import('package').Constructor>>}
 *
 * So, all types that are useful to the end user should be declared here and
 * imported from here into modules where required so that we can support both.
 */

/**
 * @typedef Options
 * @property {String} [source="./pages"] - The directory containing your markdown and image content files
 * @property {String} [pathPrefix="/"] - Prepends generated URL paths with this prefix (this should match the route mounted)
 * @property {String[]} [taxonomies=["tags"]] - Frontmatter properties to use as a list of tags used to create logical groupings of content
 * @property {Boolean} [hideDraftPages=true] - Exclude draft pages from navigation, defaults to true in production and false in development
 */

/**
 * @typedef Page
 * @property {String} filePath - The full path to the file on disk
 * @property {String} fileName - The file base name
 * @property {String} id - A unique randomly generated ID for internal use
 * @property {Number} order - The sort order taken from the file name or parent folder name
 * @property {String} url - The generated friendly URL for the page
 * @property {String} html - The transformed HTML content of the page
 * @property {String} text - The transformed text content of the page
 * @property {String[]} childIDs - The IDs of pages one level deeper in the navigation hierarchy
 * @property {String} parentID - The ID of any parent page
 *
 * @property {String} [title] - Title for the page taken from page frontmatter
 * @property {String} [description] - Description for the page taken from page frontmatter
 * @property {String} [cloneContentFrom] - A relative path to another page to clone content from
 * @property {String} [redirect] - A URL or relative path to redirect to instead of displaying the page
 * @property {Boolean} [draft] - Pages set to draft status will be excluded from navigation properties in production only
 * @property {Boolean} [hidden] - Pages set to hidden will always be excluded from navigation properties
 */

/**
 * @typedef Image
 * @property {String} filePath - The full path to the file on disk
 * @property {String} fileName - The file base name
 * @property {String} id - A unique randomly generated ID for internal use
 * @property {String} url - The generated friendly URL for the image
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

module.exports = {};
