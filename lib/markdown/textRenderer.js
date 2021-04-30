/**
 * this is a clone of https://github.com/ejrbuss/markdown-to-txt but it enables
 * us to provide our own copy of Marked and stay up-to-date.
 */

const blockFn = block => `${block}\n`;
const inlineFn = text => text;
const newlineFn = () => '\n';
const emptyFn = () => '';

const textRenderer = {
	// Block elements
	code: emptyFn,
	blockquote: blockFn,
	html: emptyFn,
	heading: blockFn,
	hr: emptyFn,
	list: blockFn,
	listitem: text => blockFn(text),
	paragraph: blockFn,
	table: (header, body) => blockFn(header) + blockFn(body),
	tablerow: blockFn,
	tablecell: blockFn,
	// Inline elements
	strong: inlineFn,
	em: inlineFn,
	codespan: inlineFn,
	br: newlineFn,
	del: inlineFn,
	link: (href, title, text) => inlineFn(text),
	image: (src, title, text) => inlineFn(text),
	text: inlineFn,
};

module.exports = { textRenderer };
