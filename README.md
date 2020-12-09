# @financial-times/express-markdown-pages

[![CircleCI](https://img.shields.io/circleci/project/github/Financial-Times/express-markdown-pages/main.svg)](https://circleci.com/gh/Financial-Times/express-markdown-pages) [![NPM version](https://img.shields.io/npm/v/@financial-times/express-markdown-pages.svg)](https://www.npmjs.com/package/@financial-times/express-markdown-pages)

An Express middleware that transforms plain text files into dynamic pages and fits right into your existing app.

```js
const { markdownPages } = require('@financial-times/express-markdown-pages');

app.get('/', markdownPages(), (request, response) => {
	response.render('myMarkdownPage.ejs');
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

This module provides a single `markdownPages` function which can be called with [options](#options).

```js
const expressMarkdownPages = require('@financial-times/express-markdown-pages');

const markdownPages = expressMarkdownPages.create({
	source: './content',
	pathPrefix: '/docs',
});
```

This function returns a new [Express router] to insert into your app (_note:_ if you're adding the handler to a nested path then make sure to specify the `pathPrefix` option!):

```js
const express = require('express');
const app = express();

app.get('/docs', markdownPages, () => { ... });
```

The provided route handler will find the pages which match the requests it receives and will append the page, navigation, taxonomy, or search result data to `response.locals`.

```js
app.get('/docs', markdownPages, (request, response) => {
	console.log(response.locals); // logs: { page, navigation, taxonomies, results }
});
```

Finally, using this data you can render your pages however you like:

```js
app.get('/docs', scs, (request, response) => {
	const html = myTemplate(response.locals);
	response.send(html);
});
```

[express router]: https://expressjs.com/en/4x/api.html#express.router

### Options

The `markdownPages` function accepts the following parameters:

| Option       | Type     | Required | Description                                                                                                         |
| ------------ | -------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `source`     | String   |          | The directory containing your Markdown and image content files. Defaults to `"./pages"`.                            |
| `pathPrefix` | String   |          | Prepends all generated URL paths with this prefix (this should match the route mounted.) Defaults to `"/"`.         |
| `taxonomies` | String[] |          | Frontmatter properties to use as a list of tags used to create logical groupings of content. Defaults to `["tags"]` |

## Errors

### `HTTPError`

All non-20x responses will throw a corresponding error created by the [`http-errors`](https://www.npmjs.com/package/http-errors) package. This includes `BadRequest`, `NotFound`, and `InternalServerError` errors. If the API returns a detailed error then this will be used as the error message. The raw response may be appended to the error as the `details` property for further inspection.
