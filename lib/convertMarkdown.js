const { marked } = require('marked');
const entities = require('html-entities');
const { HTMLRenderer } = require('./markdown/HTMLRenderer');
const { TextRenderer } = require('./markdown/TextRenderer');
const { describeEmoji } = require('./markdown/describeEmoji');

/**
 * Markdown to HTML
 * @param {String} content
 * @param {import('marked').MarkedOptions} markedOptions
 * @returns {String}
 */
function markdownToHTML(content, markedOptions = {}) {
	const options = {
		// Enable GitHub flavoured Markdown
		gfm: true,
		// Enable smart quotes and other typographic enhancements
		smartypants: true,
		// use our custom renderer with overrides
		renderer: new HTMLRenderer(),
		// Wrap emoji characters with an accessible description
		walkTokens: token => {
			if (token.type === 'text') {
				token.text = describeEmoji(token.text);
			}
		},
		...markedOptions,
	};

	return marked(content, options);
}

/**
 * Markdown to text
 * @param {String} content
 * @param {import('marked').MarkedOptions} markedOptions
 * @returns {String}
 */
function markdownToText(content, markedOptions = {}) {
	const options = {
		renderer: new TextRenderer(),
		...markedOptions,
	};

	const text = marked(content, options);

	return entities.decode(text);
}

module.exports = { markdownToHTML, markdownToText };
