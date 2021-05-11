const { Renderer } = require('marked');
const { escape } = require('marked/src/helpers');
const {
	isInternalLink,
	isInternalImage,
	createPathForFile,
	createPathForPage,
} = require('../linkUtils');

const NOTICE_REGEXP = /^<p>\[(Success|Warning|Error|Inform)\]:\s*/i;

class HTMLRenderer extends Renderer {
	// Extends blockquote syntax with support for "message blocks"
	// Usage: > [TYPE] message
	// Idea copied from <https://docup.egoist.sh>
	blockquote(quote) {
		const notice = NOTICE_REGEXP.exec(quote);

		if (notice) {
			const type = notice.pop();

			const html = `
				<div class="o-message o-message--${type.toLowerCase()}">
					<div class="o-message__container">
						<div class="o-message__content">
							<p class="o-message__content-main">${quote.replace(NOTICE_REGEXP, '')}
						</div>
					</div>
				</div>
			`;

			return html.trim();
		}

		return super.blockquote(quote);
	}

	// Override rendering of code blocks so that we can
	// enable Origami's syntax highlighting.
	code(code, language, escaped) {
		const cleaned = escaped ? code : escape(code);

		const html = `
			<div data-o-component="o-syntax-highlight">
				<pre><code class="o-syntax-highlight--${language}">${cleaned}</code></pre>
			</div>
		`;

		return html.trim();
	}

	link(href, title, text) {
		// Transform local links between Markdown files into friendly URLs
		// NOTE: The CommonMark specification says that a link destination cannot
		// include any spaces or control characters so they must be encoded.
		// <https://spec.commonmark.org/0.29/#link-destination>
		if (isInternalLink(href)) {
			href = createPathForPage(decodeURI(href));
		}

		return super.link(href, title, text);
	}

	image(href, title, text) {
		// Transform references to local images into friendly URLs
		if (isInternalImage(href)) {
			href = createPathForFile(href);
		}

		return super.image(href, title, text);
	}

	table(header, body) {
		return `
			<div class="o-table-container">
				<table class="o-table">
					<thead>${header}</thead>
					${body ? `<tbody>${body}</tbody>` : ''}
				</table>
			</div>
		`;
	}
}

module.exports = { HTMLRenderer };
