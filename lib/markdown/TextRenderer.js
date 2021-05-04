/**
 * This is based on https://github.com/ejrbuss/markdown-to-txt but it enables
 * us to provide our own copy of Marked and stay up-to-date.
 */

const { Renderer } = require('marked');

const blockFn = block => `${block}\n`;
const inlineFn = text => text;
const newlineFn = () => '\n';
const emptyFn = () => '';

class TextRenderer extends Renderer {
	/** Block functions */
	code() {
		return emptyFn();
	}

	blockquote(text) {
		return blockFn(text);
	}

	html() {
		return emptyFn();
	}

	heading(text) {
		return blockFn(text);
	}

	hr() {
		return emptyFn();
	}

	list(body) {
		return blockFn(body);
	}

	listitem(text) {
		return blockFn(text);
	}

	checkbox() {
		return emptyFn();
	}

	paragraph(text) {
		return blockFn(text);
	}

	table(header, body) {
		return `${blockFn(header)}${blockFn(body)}`;
	}

	tablerow(content) {
		return blockFn(content);
	}

	tablecell(content) {
		return blockFn(content);
	}

	/** inline functions */
	strong(text) {
		return inlineFn(text);
	}

	em(text) {
		return inlineFn(text);
	}

	codespan(text) {
		return inlineFn(text);
	}

	br() {
		return newlineFn();
	}

	del(text) {
		return inlineFn(text);
	}

	link(href, title, text) {
		return inlineFn(text);
	}

	image(href, title, text) {
		return inlineFn(text);
	}

	text(text) {
		return inlineFn(text);
	}
}

module.exports = { TextRenderer };
