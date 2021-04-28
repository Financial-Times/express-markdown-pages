const marked = require('marked');
const entities = require('html-entities');
const { HTMLRenderer } = require('./markdown/HTMLRenderer');
const { textRenderer } = require('./markdown/textRenderer');

function markdownToHTML(content, markedOptions = {}) {
	const options = {
		// Enable GitHub flavoured Markdown
		gfm: true,
		// Enable smart quotes and other typographic enhancements
		smartypants: true,
		// use our custom renderer with overrides
		renderer: new HTMLRenderer(),
		...markedOptions,
	};

	return marked(content, options);
}

function markdownToText(content, markedOptions = {}) {
	const options = {
		renderer: textRenderer,
		...markedOptions,
	};

	const text = marked(content, options);

	return entities.decode(text);
}

module.exports = { markdownToHTML, markdownToText };
