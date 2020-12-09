# @financial-times/express-markdown-pages

[![CircleCI](https://img.shields.io/circleci/project/github/Financial-Times/express-markdown-pages/main.svg)](https://circleci.com/gh/Financial-Times/express-markdown-pages) [![NPM version](https://img.shields.io/npm/v/@financial-times/express-markdown-pages.svg)](https://www.npmjs.com/package/@financial-times/express-markdown-pages)

An Express middleware that transforms plain text files into dynamic pages and fits right into your existing app.

```js
const { MarkdownPages } = require('@financial-times/express-markdown-pages');

const markdownPages = new MarkdownPages();

app.route('/*')
	.get(markdownPages.middleware)
	.get((request, response) => {
		const html = myTemplate(response.locals);
		response.send(html);
	});
```

[1]: https://github.com/Financial-Times/biz-ops-api#api

## Installation

This is package for [Node.js] and is available through the [npm] registry. Node 12 or higher is required.

Installation is done using the [npm install] command:

```bash
npm install -S @financial-times/express-markdown-pages
```

[node.js]: https://nodejs.org/
[npm]: http://npmjs.com/
[npm install]: https://docs.npmjs.com/getting-started/installing-npm-packages-locally

## Features

-   Fits right into your existing Express app, how you render the output is up to you!
-   Finds and transforms Markdown files into HTML with Origami compatible output.
-   Generates hierarchical navigation and user-friendly URLs.
-   Supports taxonomies to dynamically group and filter content.

## Getting started

Start by creating a new instance of `MarkdownPages` and provide the appropriate [options](#options) for your app:

```js
const { MarkdownPages } = require('@financial-times/express-markdown-pages');

const markdownPages = new MarkdownPages({
	source: './content',
	pathPrefix: '/docs',
});
```

Next, add a new route to your app to serve your Markdown pages from, please note this must end with an asterisk (`*`) so that Express knows to route all requests to URLs beginning with this path through the `MarkdownPages` middleware:

```js
app.route('/docs*');
```

Next, mount the `MarkdownPages` middleware to the route you just added so that it is applied to all `GET` requests:

```js
app.route('/docs*').get(markdownPages.middleware);
```

Next, add a final [route handler] function for `GET` requests to this route. This function will use the data added by the `MarkdownPages` middleware to render your pages:

```js
app.route('/docs*')
	.get(markdownPages.middleware)
	.get((request, response) => {
		const html = myTemplate(response.locals);
		response.send(html);
	});
```

Finally, you must initialise `MarkdownPages` so that it can find all of your files and construct its database. We recommend doing this on app startup so that you can spot any errors:

```js
try {
	await markdownPages.init();

	app.listen(PORT, () => {
		console.log(`App listening on http://localhost:${PORT}`);
	});
} catch (error) {
	console.error(`The app failed to start: ${error}`);
	process.exit(1);
}
```

[route handler]: https://expressjs.com/en/guide/routing.html#route-handlers

### Options

The `MarkdownPages` constructor accepts the following parameters:

| Option       | Type     | Required | Description                                                                                                         |
| ------------ | -------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `source`     | String   |          | The directory containing your Markdown and image content files. Defaults to `"./pages"`.                            |
| `pathPrefix` | String   |          | Prepends all generated URL paths with this prefix (this should match the route mounted.) Defaults to `"/"`.         |
| `taxonomies` | String[] |          | Frontmatter properties to use as a list of tags used to create logical groupings of content. Defaults to `["tags"]` |

## Errors

### `HTTPError`

All non-20x responses will throw a corresponding error created by the [`http-errors`](https://www.npmjs.com/package/http-errors) package. This includes `BadRequest`, `NotFound`, and `InternalServerError` errors. If the API returns a detailed error then this will be used as the error message. The raw response may be appended to the error as the `details` property for further inspection.
