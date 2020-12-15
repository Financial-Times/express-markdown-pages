const PORT = process.env.PORT || 3000;

const express = require('express');

const app = express();

const { MarkdownPages } = require('./lib');

const markdownPages = new MarkdownPages({
	source: './docs',
});

app.get('*', markdownPages.middleware, (_, response) => {
	response.send(response.locals);
});

markdownPages
	.init()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Listening on http://localhost:${PORT}`); // eslint-disable-line no-console
		});
	})
	.catch(error => {
		console.error(`The application failed to start: ${error}`); // eslint-disable-line no-console
		process.exit(1); // eslint-disable-line unicorn/no-process-exit
	});
