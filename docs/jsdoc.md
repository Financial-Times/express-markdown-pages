## Classes

-   [MarkdownPages](#MarkdownPages)
    -   [new MarkdownPages(userOptions)](#new_MarkdownPages_new)
    -   [.init()](#MarkdownPages+init) ⇒ <code>Promise.&lt;module:lokijs&gt;</code>
    -   [.middleware(request, response, next)](#MarkdownPages+middleware) ⇒ <code>Promise.&lt;void&gt;</code>
    -   [.getPage(url)](#MarkdownPages+getPage) ⇒ <code>Promise.&lt;(Page\|null)&gt;</code>
    -   [.getImage(url)](#MarkdownPages+getImage) ⇒ <code>Promise.&lt;(Image\|null)&gt;</code>
    -   [.getPageData(page, [queryParams])](#MarkdownPages+getPageData) ⇒ [<code>Promise.&lt;PageData&gt;</code>](#PageData)

## Typedefs

-   [Options](#Options)
-   [Page](#Page)
-   [Image](#Image)
-   [Navigation](#Navigation)
-   [TaxonomyOption](#TaxonomyOption)
-   [Taxonomy](#Taxonomy)
-   [PageData](#PageData)

<a name="MarkdownPages"></a>

## MarkdownPages

**Kind**: global class

-   [MarkdownPages](#MarkdownPages)
    -   [new MarkdownPages(userOptions)](#new_MarkdownPages_new)
    -   [.init()](#MarkdownPages+init) ⇒ <code>Promise.&lt;module:lokijs&gt;</code>
    -   [.middleware(request, response, next)](#MarkdownPages+middleware) ⇒ <code>Promise.&lt;void&gt;</code>
    -   [.getPage(url)](#MarkdownPages+getPage) ⇒ <code>Promise.&lt;(Page\|null)&gt;</code>
    -   [.getImage(url)](#MarkdownPages+getImage) ⇒ <code>Promise.&lt;(Image\|null)&gt;</code>
    -   [.getPageData(page, [queryParams])](#MarkdownPages+getPageData) ⇒ [<code>Promise.&lt;PageData&gt;</code>](#PageData)

<a name="new_MarkdownPages_new"></a>

### new MarkdownPages(userOptions)

Create a new instance of the Markdown pages

| Param       | Type                             | Description    |
| ----------- | -------------------------------- | -------------- |
| userOptions | [<code>Options</code>](#Options) | Client options |

**Example**

```js
const markdownPages = new MarkDownPages({ source: './docs' });
```

<a name="MarkdownPages+init"></a>

### markdownPages.init() ⇒ <code>Promise.&lt;module:lokijs&gt;</code>

Initialises the database for your app's pages and images. This is not
required but enables you to store a reference to the database for use in your app.

**Kind**: instance method of [<code>MarkdownPages</code>](#MarkdownPages)
**Example**

```js
const db = await markdownPages.init();
const pages = db.getCollection('pages');
const homePage = db.by('url', '/');
```

<a name="MarkdownPages+middleware"></a>

### markdownPages.middleware(request, response, next) ⇒ <code>Promise.&lt;void&gt;</code>

An Express compatible route handler which appends page data to
response.locals or serves image files.

**Kind**: instance method of [<code>MarkdownPages</code>](#MarkdownPages)

| Param    | Type                                     |
| -------- | ---------------------------------------- |
| request  | <code>module:express~Request</code>      |
| response | <code>module:express~Response</code>     |
| next     | <code>module:express~NextFunction</code> |

**Example**

```js
app.get('/docs/*', markdownPages.middleware, (req, res) => {});
```

<a name="MarkdownPages+getPage"></a>

### markdownPages.getPage(url) ⇒ <code>Promise.&lt;(Page\|null)&gt;</code>

Fetches the content for the page with the given URL.

**Kind**: instance method of [<code>MarkdownPages</code>](#MarkdownPages)

| Param | Type                |
| ----- | ------------------- |
| url   | <code>String</code> |

**Example**

```js
const aboutPage = markdownPages.getPage('/about-us');
```

<a name="MarkdownPages+getImage"></a>

### markdownPages.getImage(url) ⇒ <code>Promise.&lt;(Image\|null)&gt;</code>

Fetches metadata for an image with the given URL.

**Kind**: instance method of [<code>MarkdownPages</code>](#MarkdownPages)

| Param | Type                |
| ----- | ------------------- |
| url   | <code>String</code> |

**Example**

```js
const dogImage = markdownPages.getImage('/images/dog.jpg');
```

<a name="MarkdownPages+getPageData"></a>

### markdownPages.getPageData(page, [queryParams]) ⇒ [<code>Promise.&lt;PageData&gt;</code>](#PageData)

Fetches all data for the given page, including navigation
and taxonomies/results for index pages.

**Kind**: instance method of [<code>MarkdownPages</code>](#MarkdownPages)

| Param         | Type                            | Default         |
| ------------- | ------------------------------- | --------------- |
| page          | [<code>Page</code>](#Page)      |                 |
| [queryParams] | <code>module:qs~ParsedQs</code> | <code>{}</code> |

**Example**

```js
const aboutPage = markdownPages.getPage('/about-us');
const pageData = markdownPages.getDataForPage(aboutPage);
```

<a name="Options"></a>

## Options

**Kind**: global typedef
**Properties**

| Name             | Type                              | Default                          | Description                                                                                  |
| ---------------- | --------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------- |
| [source]         | <code>String</code>               | <code>&quot;./pages&quot;</code> | The directory containing your markdown and image content files                               |
| [pathPrefix]     | <code>String</code>               | <code>&quot;/&quot;</code>       | Prepends generated URL paths with this prefix (this should match the route mounted)          |
| [taxonomies]     | <code>Array.&lt;String&gt;</code> | <code>[&quot;tags&quot;]</code>  | Frontmatter properties to use as a list of tags used to create logical groupings of content  |
| [hideDraftPages] | <code>Boolean</code>              | <code>true</code>                | Exclude draft pages from navigation, defaults to true in production and false in development |

<a name="Page"></a>

## Page

**Kind**: global typedef
**Properties**

| Name               | Type                              | Description                                                                              |
| ------------------ | --------------------------------- | ---------------------------------------------------------------------------------------- |
| filePath           | <code>String</code>               | The full path to the file on disk                                                        |
| fileName           | <code>String</code>               | The file base name                                                                       |
| id                 | <code>String</code>               | A unique randomly generated ID for internal use                                          |
| order              | <code>Number</code>               | The sort order taken from the file name or parent folder name                            |
| url                | <code>String</code>               | The generated friendly URL for the page                                                  |
| html               | <code>String</code>               | The transformed HTML content of the page                                                 |
| text               | <code>String</code>               | The transformed text content of the page                                                 |
| childIDs           | <code>Array.&lt;String&gt;</code> | The IDs of pages one level deeper in the navigation hierarchy                            |
| parentID           | <code>String</code>               | The ID of any parent page                                                                |
| [title]            | <code>String</code>               | Title for the page taken from page frontmatter                                           |
| [description]      | <code>String</code>               | Description for the page taken from page frontmatter                                     |
| [cloneContentFrom] | <code>String</code>               | A relative path to another page to clone content from                                    |
| [redirect]         | <code>String</code>               | A URL or relative path to redirect to instead of displaying the page                     |
| [draft]            | <code>Boolean</code>              | Pages set to draft status will be excluded from navigation properties in production only |
| [hidden]           | <code>Boolean</code>              | Pages set to hidden will always be excluded from navigation properties                   |

<a name="Image"></a>

## Image

**Kind**: global typedef
**Properties**

| Name     | Type                | Description                                     |
| -------- | ------------------- | ----------------------------------------------- |
| filePath | <code>String</code> | The full path to the file on disk               |
| fileName | <code>String</code> | The file base name                              |
| id       | <code>String</code> | A unique randomly generated ID for internal use |
| url      | <code>String</code> | The generated friendly URL for the image        |

<a name="Navigation"></a>

## Navigation

**Kind**: global typedef
**Properties**

| Name      | Type                                     | Description                                                                                            |
| --------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| ancestors | [<code>Array.&lt;Page&gt;</code>](#Page) | Pages traversing up the navigation hierarchy from the current page, can be used to render a crumbtrail |
| siblings  | [<code>Array.&lt;Page&gt;</code>](#Page) | Pages at the same level in the navigation hierarchy as the current page                                |
| children  | [<code>Array.&lt;Page&gt;</code>](#Page) | Any immediate descendants in the navigation hierarchy for the current page                             |
| current   | [<code>Page</code>](#Page)               | A reference to the current page                                                                        |

<a name="TaxonomyOption"></a>

## TaxonomyOption

**Kind**: global typedef
**Properties**

| Name     | Type                 |
| -------- | -------------------- |
| name     | <code>String</code>  |
| selected | <code>Boolean</code> |
| href     | <code>String</code>  |

<a name="Taxonomy"></a>

## Taxonomy

**Kind**: global typedef
**Properties**

| Name    | Type                                                         |
| ------- | ------------------------------------------------------------ |
| label   | <code>String</code>                                          |
| name    | <code>String</code>                                          |
| options | [<code>Array.&lt;TaxonomyOption&gt;</code>](#TaxonomyOption) |

<a name="PageData"></a>

## PageData

**Kind**: global typedef
**Properties**

| Name       | Type                                                                  | Description                                                                            |
| ---------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| page       | [<code>Page</code>](#Page)                                            |                                                                                        |
| navigation | [<code>Navigation</code>](#Navigation)                                |                                                                                        |
| taxonomies | [<code>Array.&lt;Taxonomy&gt;</code>](#Taxonomy) \| <code>null</code> | A list of taxonomies and tags used by any child pages. Only populated for index pages. |
| results    | [<code>Array.&lt;Page&gt;</code>](#Page) \| <code>null</code>         | A list of child pages filtered by selected tags. Only populated for index pages.       |
