const qs = require('qs');
const pluralize = require('pluralize');

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
 * Create query string
 * @param {String} tag
 * @param {String} taxonomy
 * @param {Boolean} selected
 * @param {import('qs').ParsedQs} queryParams
 * @returns {String}
 */
function createFilterQueryString(tag, taxonomy, selected, queryParams) {
	const filters = {
		...queryParams.filters,
		[taxonomy]: selected ? undefined : tag,
	};

	// The qs package supports nested objects, e.g. foo[bar]=baz
	// We use this to nest our filters and avoid interfering with the app.
	const newQueryString = qs.stringify({ ...queryParams, filters });

	return `?${newQueryString}`;
}

/**
 * Create taxonomy options
 * @param {String[]} tags
 * @param {String} taxonomy
 * @param {import('qs').ParsedQs} queryParams
 * @returns {TaxonomyOption[]}
 */
function createTaxonomyOptions(tags, taxonomy, queryParams) {
	const queryParam =
		queryParams.filters && queryParams.filters[taxonomy]
			? queryParams.filters[taxonomy]
			: null;

	return tags.map(tag => {
		const selected = tag === queryParam;

		return {
			selected,
			name: tag,
			href: createFilterQueryString(tag, taxonomy, selected, queryParams),
		};
	});
}

/**
 * Filter pages with params
 * @param {import('./createPages').Page[]} pages
 * @param {String[]} taxonomies
 * @param {import('qs').ParsedQs} queryParams
 * @returns {import('./createPages').Page[]}
 */
function filterPagesWithParams(pages, taxonomies, queryParams) {
	return pages.filter(page => {
		return taxonomies.every(taxonomy => {
			const filter = queryParams.filters && queryParams.filters[taxonomy];

			if (filter) {
				const tags = getTagsFromPage(page, taxonomy);
				return tags.includes(filter);
			}
			return true;
		});
	});
}

/**
 * Get taxonomies
 * @param {import('./createPages').Page[]} pages
 * @param {String[]} taxonomies
 * @param {import('qs').ParsedQs} queryParams
 * @returns {Taxonomy[]}
 */
function getTaxonomies(pages, taxonomies, queryParams) {
	return taxonomies.map(taxonomy => {
		const tags = getTagsFromPages(pages, taxonomy);

		return {
			name: taxonomy,
			label: pluralize.singular(taxonomy),
			options: createTaxonomyOptions(tags, taxonomy, queryParams),
		};
	});
}

module.exports = {
	getTagsFromPage,
	getTagsFromPages,
	createFilterQueryString,
	createTaxonomyOptions,
	filterPagesWithParams,
	getTaxonomies,
};
