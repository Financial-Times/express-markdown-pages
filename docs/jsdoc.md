## Modules

<dl>
<dt><a href="#module_lib/MarkdownPages">lib/MarkdownPages</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Page">Page</a></dt>
<dd></dd>
<dt><a href="#Image">Image</a></dt>
<dd></dd>
<dt><a href="#Navigation">Navigation</a></dt>
<dd></dd>
<dt><a href="#TaxonomyOption">TaxonomyOption</a></dt>
<dd></dd>
<dt><a href="#Taxonomy">Taxonomy</a></dt>
<dd></dd>
<dt><a href="#PageData">PageData</a></dt>
<dd></dd>
</dl>

<a name="module_lib/MarkdownPages"></a>

## lib/MarkdownPages

-   [lib/MarkdownPages](#module_lib/MarkdownPages)
    -   [~MarkdownPages](#module_lib/MarkdownPages..MarkdownPages)
        -   [new MarkdownPages(userOptions)](#new_module_lib/MarkdownPages..MarkdownPages_new)
        -   [.middleware(request, response, next)](#module_lib/MarkdownPages..MarkdownPages+middleware) ⇒ <code>Promise.&lt;void&gt;</code>
        -   [.init()](#module_lib/MarkdownPages..MarkdownPages+init) ⇒ <code>Promise.&lt;module:lokijs&gt;</code>
    -   [~Options](#module_lib/MarkdownPages..Options)

<a name="module_lib/MarkdownPages..MarkdownPages"></a>

### lib/MarkdownPages~MarkdownPages

**Kind**: inner class of [<code>lib/MarkdownPages</code>](#module_lib/MarkdownPages)

-   [~MarkdownPages](#module_lib/MarkdownPages..MarkdownPages)
    -   [new MarkdownPages(userOptions)](#new_module_lib/MarkdownPages..MarkdownPages_new)
    -   [.middleware(request, response, next)](#module_lib/MarkdownPages..MarkdownPages+middleware) ⇒ <code>Promise.&lt;void&gt;</code>
    -   [.init()](#module_lib/MarkdownPages..MarkdownPages+init) ⇒ <code>Promise.&lt;module:lokijs&gt;</code>

<a name="new_module_lib/MarkdownPages..MarkdownPages_new"></a>

#### new MarkdownPages(userOptions)

Create a new instance of the Markdown pages

| Param       | Type                 | Description    |
| ----------- | -------------------- | -------------- |
| userOptions | <code>Options</code> | Client options |

**Example**

```js
const markdownPages = new MarkDownPages({ source: './docs' });
```

<a name="module_lib/MarkdownPages..MarkdownPages+middleware"></a>

#### markdownPages.middleware(request, response, next) ⇒ <code>Promise.&lt;void&gt;</code>

An Express compatible route handler which appenda page data to
response.locals or serves image files.

**Kind**: instance method of [<code>MarkdownPages</code>](#module_lib/MarkdownPages..MarkdownPages)

| Param    | Type                                     |
| -------- | ---------------------------------------- |
| request  | <code>module:express~Request</code>      |
| response | <code>module:express~Response</code>     |
| next     | <code>module:express~NextFunction</code> |

**Example**

```js
app.get('/docs/*', markdownPages.middleware, (req, res) => {});
```

<a name="module_lib/MarkdownPages..MarkdownPages+init"></a>

#### markdownPages.init() ⇒ <code>Promise.&lt;module:lokijs&gt;</code>

Initialises the database for your app's pages and images. This is not
required but enables you to store a reference to the database for use in your app.

**Kind**: instance method of [<code>MarkdownPages</code>](#module_lib/MarkdownPages..MarkdownPages)  
**Example**

```js
const db = await markdownPages.init();
const pages = db.getCollection('pages');
const homePage = db.by('slug', '/');
```

<a name="module_lib/MarkdownPages..Options"></a>

### lib/MarkdownPages~Options

**Kind**: inner typedef of [<code>lib/MarkdownPages</code>](#module_lib/MarkdownPages)  
**Properties**

| Name         | Type                              | Default                          | Description                                                                                 |
| ------------ | --------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------- |
| [source]     | <code>String</code>               | <code>&quot;./pages&quot;</code> | The directory containing your markdown and image content files                              |
| [pathPrefix] | <code>String</code>               | <code>&quot;/&quot;</code>       | Prepends generated URL paths with this prefix (this should match the route mounted)         |
| [taxonomies] | <code>Array.&lt;String&gt;</code> | <code>[&quot;tags&quot;]</code>  | Frontmatter properties to use as a list of tags used to create logical groupings of content |

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
| slug               | <code>String</code>               | The generated URL path for the page                                                      |
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
| slug     | <code>String</code> | The generated URL path for the page             |

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
