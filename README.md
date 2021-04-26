# @financial-times/express-markdown-pages

[![CircleCI](https://img.shields.io/circleci/project/github/Financial-Times/express-markdown-pages/main.svg)](https://circleci.com/gh/Financial-Times/express-markdown-pages) [![NPM version](https://img.shields.io/npm/v/@financial-times/express-markdown-pages.svg)](https://www.npmjs.com/package/@financial-times/express-markdown-pages)

An Express middleware that transforms plain text files into dynamic pages and fits right into your existing app.

```js
const { MarkdownPages } = require('@financial-times/express-markdown-pages');

const markdownPages = new MarkdownPages();

app.get('/*', markdownPages.middleware, (request, response) => {
	const html = myTemplate(response.locals.markdownPages);
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
-   Author content that works in your editor, on GitHub, and on your website.
-   Generates hierarchical navigation and user-friendly URLs.
-   Supports taxonomies to dynamically group and filter content.
-   Include images alongside your Markdown content, they'll work too.

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
app.get('/docs*');
```

Next, add the `MarkdownPages` middleware to the route you just added:

```js
app.get('/docs*', markdownPages.middleware);
```

Next, add a final [route handler] function. This function can use [the data](#page-data) added by the `MarkdownPages` middleware to render your pages. Please note, if a page can't be found, or the incoming request is for an image file, then this function will not be called:

```js
app.get('/docs*', markdownPages.middleware, (request, response) => {
	response.send(response.locals.markdownPages);
});
```

Finally, we recommend initialising `MarkdownPages` on app startup. This is not necessary but it will help you to spot any errors with your content and you can also store a reference to the created database for access later:

```js
try {
	const db = await markdownPages.init();
	const pageCount = db.getCollection('pages').count();

	app.listen(PORT, () => {
		console.log(`App listening on http://localhost:${PORT}`);
		console.log(`Successfully loaded ${pageCount} pages`);
	});
} catch (error) {
	console.error('The app failed to start: ', error);
	process.exit(1);
}
```

Now you're up and running you can get on with using [the data](#page-data) in your templates!

[route handler]: https://expressjs.com/en/guide/routing.html#route-handlers

### Options

The `MarkdownPages` constructor accepts the following parameters:

| Option       | Type     | Required | Description                                                                                                                  |
| ------------ | -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `source`     | String   |          | The directory containing your Markdown and image content files. Defaults to `"./pages"`.                                     |
| `pathPrefix` | String   |          | Prepends all generated URL paths with this prefix (which should match the route mounted, minus asterisk.) Defaults to `"/"`. |
| `taxonomies` | String[] |          | Frontmatter properties to use as a list of tags used to create logical groupings of content. Defaults to `["tags"]`          |

## Page Data

The middleware provided by this package will append a `markdownPages` property to the [`response.locals` object](https://expressjs.com/en/4x/api.html#res.locals). This object includes the content for the requested page and navigation hierarchy, and for index pages it will also include any taxonomies for child pages, and child pages which match any selected filters. See [type definitions](#type-definitions) for more information.

## Type definitions

### Page

| Name               | Type                              | Description                                                          |
| ------------------ | --------------------------------- | -------------------------------------------------------------------- |
| filePath           | <code>String</code>               | The full path to the file on disk                                    |
| fileName           | <code>String</code>               | The file base name                                                   |
| id                 | <code>String</code>               | A unique randomly generated ID for internal use                      |
| index              | <code>Number</code>               | The sort index taken from the file or parent folder name             |
| slug               | <code>String</code>               | The generated URL path for the page                                  |
| html               | <code>String</code>               | The transformed HTML content of the page                             |
| text               | <code>String</code>               | The transformed text content of the page                             |
| childIDs           | <code>Array.&lt;String&gt;</code> | The IDs of pages one level deeper in the navigation hierarchy        |
| parentID           | <code>String</code>               | The ID of any parent page                                            |
| [title]            | <code>String</code>               | Title for the page taken from page frontmatter                       |
| [description]      | <code>String</code>               | Description for the page taken from page frontmatter                 |
| [cloneContentFrom] | <code>String</code>               | A relative path to another page to clone content from                |
| [redirect]         | <code>String</code>               | A URL or relative path to redirect to instead of displaying the page |

### Image

| Name     | Type                | Description                                     |
| -------- | ------------------- | ----------------------------------------------- |
| filePath | <code>String</code> | The full path to the file on disk               |
| fileName | <code>String</code> | The file base name                              |
| id       | <code>String</code> | A unique randomly generated ID for internal use |
| slug     | <code>String</code> | The generated URL path for the page             |

### Navigation

| Name      | Type                                     | Description                                                                                            |
| --------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| ancestors | [<code>Array.&lt;Page&gt;</code>](#Page) | Pages traversing up the navigation hierarchy from the current page, can be used to render a crumbtrail |
| siblings  | [<code>Array.&lt;Page&gt;</code>](#Page) | Pages at the same level in the navigation hierarchy as the current page                                |
| children  | [<code>Array.&lt;Page&gt;</code>](#Page) | Any immediate descendants in the navigation hierarchy for the current page                             |
| current   | [<code>Page</code>](#Page)               | A reference to the current page                                                                        |

### TaxonomyOption

| Name     | Type                 |
| -------- | -------------------- |
| name     | <code>String</code>  |
| selected | <code>Boolean</code> |
| href     | <code>String</code>  |

### Taxonomy

| Name    | Type                                                         |
| ------- | ------------------------------------------------------------ |
| label   | <code>String</code>                                          |
| name    | <code>String</code>                                          |
| options | [<code>Array.&lt;TaxonomyOption&gt;</code>](#TaxonomyOption) |

### PageData

| Name       | Type                                                                  | Description                                                                            |
| ---------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| page       | [<code>Page</code>](#Page)                                            |                                                                                        |
| navigation | [<code>Navigation</code>](#Navigation)                                |                                                                                        |
| taxonomies | [<code>Array.&lt;Taxonomy&gt;</code>](#Taxonomy) \| <code>null</code> | A list of taxonomies and tags used by any child pages. Only populated for index pages. |
| results    | [<code>Array.&lt;Page&gt;</code>](#Page) \| <code>null</code>         | A list of child pages filtered by selected tags. Only populated for index pages.       |
