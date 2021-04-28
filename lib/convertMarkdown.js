const marked = require('marked');
const { HTMLRenderer } = require('./markdown/HTMLRenderer');
const { textRenderer } = require('./markdown/textRenderer');

function markdownToHTML(content) {
	return marked(content, {
		// Enable GitHub flavoured Markdown
		gfm: true,
		// Enable smart quotes and other typographic enhancements
		smartypants: true,
		// use our custom renderer with overrides
		renderer: new HTMLRenderer(),
	});
}

function markdownToText(content) {
	return marked(content, {
		renderer: textRenderer,
	});
}

module.exports = { markdownToHTML, markdownToText };
