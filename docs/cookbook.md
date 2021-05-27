# Guides

-   [App structure and composition](#app-structure-and-composition)
    -   [Initialising the database](#initialising-the-database)
-   [Navigation](#navigation)
    -   [Crumbtrails](#crumbtrails)
    -   [Sitemaps](#sitemaps)

---

## App structure and composition

### Initialising the database

We recommend that you initialise Express Markdown Pages before starting your server so that any problems found when loading your pages can be seen immediately. However, always loading your pages when starting your app may cause issues when testing other routes in your app and possibly create confusion. For this reason we advise you to split your Express app definition and your app entry point into separate modules.

For example, below shows a module named `app.js` which defines an Express app with two routes and has two exported properties - one providing the Express app instance, and another providing an asynchronous function which initialises Express Markdown Pages:

```js
// app.js
const express = require('express');
const { MarkdownPages } = require('@financial-times/express-markdown-pages');

const app = express();

const markdownPages = new MarkdownPages({
	source: './pages',
	pathPrefix: '/',
	taxonomies: ['subjects', 'technologies'],
});

app.get('/', require('./routes/homepage.js'));

app.get('/pages*', markdownPages.middleware, require('./routes/pages.js'));

const init = async () => {
	await markdownPages.init();
	return app;
};

module.exports = { app, init };
```

Along with this we create a second module named `start.js` which will be the module called to start our app. This module imports the `init()` function defined in `app.js` before starting the web server:

```js
// start.js
const { init } = require('./app');

const PORT = process.env.PORT || 3000;

init()
	.then(app => {
		app.listen(PORT, () => {
			console.log(`Listening on http://localhost:${PORT}`);
		});
	})
	.catch(error => {
		console.error(`The application failed to start: ${error}`);
		process.exit(1);
	});
```

Finally, in our tests - in this case using the [Supertest](https://www.npmjs.com/package/supertest) package - we can import the Express definition and test our homepage route in isolation, without loading Express Markdown Pages first:

```js
// routes/homepage.test.js
const supertest = require('supertest');
const { app } = require('../app');

describe('routes/homepage', () => {
	it('returns a successful 200 response', () => {
		return supertest(app).get('/').expect(200);
	});
});
```

---

## Navigation

Below are some examples which use the [navigation data](jsdoc.md#navigation) and hierarchical relationships between pages.

### Crumbtrails

This example uses the [navigation data](jsdoc.md#navigation) provided by default with each page to create a crumbtrail navigation component, mapping the path from the top-level page to the current one. This component is written using JSX:

```jsx
function Crumbtrail({ navigation }) {
	return (
		<nav aria-label="Crumbtrail navigation">
			<ol>
				{navigation.ancestors.map(item => (
					<li>
						<a href={item.url}>{item.title}</a>
					</li>
				))}
				<li>
					<a href={navigation.current.url} aria-current="page">
						{navigation.current.title}
					</a>
				</li>
			</ol>
		</nav>
	);
}

// Usage: <Crumbtrail navigation={pageData.navigation} />
```

### Sitemaps

This example uses the [Loki](http://techfort.github.io/LokiJS/) database created by Express Markdown Pages directly to get a reference to the top-level page, then recursively iterates from there to build a hierarchical structure representing all of the pages:

```js
function createSitemapFromPage(allPages, page) {
	const children = allPages
		.find({
			parentID: { $eq: page.id },
			hidden: { $ne: true },
		})
		.map(child => createSitemapFromPage(allPages, child));

	return { title: page.title, url: page.url, children };
}

function createSitemap(db) {
	const allPages = db.getCollection('pages');
	const homePage = pages.by('url', '/');

	return createSitemapFromPage(allPages, homePage);
}

const db = await markdownPages.init();
console.dir(createSitemap(db), { depth: Infinity });

// outputs: {
//   title: 'Home',
//   url: '/',
//   children: [
//     {
//       title: 'About',
//       url: '/about',
//       children: [ {...}, {...} ]
//     },
//     ...
//   ]
// }
```
