const express = require('express');

module.exports = async function createTestApp() {
	const app = express();

	const { MarkdownPages } = require('../../lib');

	const markdownPages = new MarkdownPages({
		source: './docs',
	});

	app.get('*', markdownPages.middleware, (_, response) => {
		response.send(response.locals.markdownPages);
	});

	// Initialising here will separate any errors thrown when creating
	// the DB from any thrown when requesting or rendering pages.
	await markdownPages.init();

	return app;
};
