const pluralize = require('pluralize');
const { stringify } = require('querystring');

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
 * Get tags from page
 * @param {import('./createPages').Page} page
 * @param {String} taxonomy
 * @returns {String[]}
 */
function getTagsFromPage(page, taxonomy) {
	return Array.isArray(page[taxonomy]) ? page[taxonomy] : [];
}

/**
 * Get tags from pages
 * @param {import('./createPages').Page[]} pages
 * @param {String} taxonomy
 * @returns {String[]}
 */
function getTagsFromPages(pages, taxonomy) {
	const tags = [];

	pages.forEach(page => {
		const pageTags = getTagsFromPage(page, taxonomy);
		tags.push(...pageTags);
	});

	// Ensure we only include each tag once
	const uniqueTags = [...new Set(tags)];

	// Sort the remaining tags alphabetically for UI consistency
	uniqueTags.sort();

	return uniqueTags;
}

/**
 * Get filter query params
 * @param {String[]} taxonomies
 * @param {Object} queryParams
 * @returns {Object}
 */
function getFilterQueryParams(taxonomies, queryParams) {
	const params = {};

	taxonomies.forEach(category => {
		if (queryParams[category]) {
			const value = decodeURIComponent(queryParams[category]);
			params[category] = value;
		}
	});

	return params;
}

/**
 * Create query string
 * @param {String} tag
 * @param {String} taxonomy
 * @param {Object} queryParams
 * @returns {String}
 */
function createFilterQueryString(tag, taxonomy, queryParams) {
	const selected = tag === queryParams[taxonomy];

	const newQueryParams = {
		[taxonomy]: selected ? null : encodeURIComponent(tag),
	};

	const newQueryString = stringify({ ...queryParams, ...newQueryParams });

	return `?${newQueryString}`;
}

/**
 * Get taxonomy options
 * @param {import('./createPages').Page[]} pages
 * @param {String} taxonomy
 * @param {Object} queryParams
 * @returns {TaxonomyOption[]}
 */
function getTaxonomyOptions(pages, taxonomy, queryParams) {
	const tags = getTagsFromPages(pages, taxonomy);

	return tags.map(tag => {
		return {
			selected: tag === queryParams[taxonomy],
			name: tag,
			href: createFilterQueryString(tag, taxonomy, queryParams),
		};
	});
}

/**
 * Get taxonomies
 * @param {String[]} taxonomies
 * @param {import('./createPages').Page[]} pages
 * @param {Object} queryParams
 * @returns {Taxonomy[]}
 */
function getTaxonomies(taxonomies, pages, queryParams) {
	return taxonomies.map(name => {
		const options = getTaxonomyOptions(pages, name, queryParams);
		const label = pluralize.singular(name);

		return { label, name, options };
	});
}

module.exports = {
	getFilterQueryParams,
	getTagsFromPage,
	getTagsFromPages,
	getTaxonomyOptions,
	getTaxonomies,
};
