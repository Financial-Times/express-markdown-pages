# Writing content

### Markdown

Markdown is a plain text format for writing structured documents. It is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.

Here is a basic example:

```markdown
It's very easy to make some words **bold** and other words _italic_ with Markdown. You can even [link to the FT!](https://www.ft.com)
```

This project uses [GitHub flavoured markdown](https://github.github.com/gfm/) which is an extension of the [CommonMark specification](https://spec.commonmark.org/). This enables all content to be viewed on GitHub as well as on the Tech Hub website.

Useful resources:

-   [Markdown Tutorial](https://commonmark.org/help/tutorial/)
-   [Mastering Markdown](https://guides.github.com/features/mastering-markdown/)

### Front matter

Front matter must be the first thing in each Markdown file and must take the form of valid [YAML](https://yaml.org/) set between triple-dashed lines. Here is a basic example:

```yaml
---
title: Writing docs like a hacker
description: Guide on how to contribute documentation
tags: [security, documentation]
---

```

Between these triple-dashed lines, you can set predefined variables:

| Variable           | Description                                                                                                                                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`            | The title of the page. This could be used as the document title, navigation links, and as the main heading of the page. **Required**.                                                                            |
| `description`      | A short sentence describing the page's content which could be used as the document description and as a summary on [index pages](#index-pages). Optional.                                                        |
| `redirect`         | A URL or [relative path](#linking-between-pages) to redirect to instead of displaying the page. Usually used for pages which have moved. Optional.                                                               |
| `cloneContentFrom` | A [relative path](#linking-between-pages) to another page to clone content from. This is useful for creating placeholders so that pages may appear in multiple places without duplicating the content. Optional. |
| `draft`            | A boolean which when true excludes the page from navigation on the production site. Optional.                                                                                                                    |
| `hidden`           | A boolean which when true always excludes pages from navigation. Optional.                                                                                                                                       |

_Please note_ that the YAML implementation used supports [types] so ambiguous values or more complex types such as dates or regular expressions can be parsed correctly.

[yaml list]: https://en.wikipedia.org/wiki/YAML#Basic_components
[types]: https://yaml.org/type/

### File and folder names

Pages are organised into a folder hierarchy. Each folder is intended to group together pages which cover a related theme. As a minimum each folder _must_ contain an `index.md` file - if you do not create an [index pages](#index-pages) in every folder then the navigation hierarchy will not be fully populated.

File and folder names can be written in upper or lower case and may contain spaces and special characters. These will all be translated into simplified friendly URLs.

By default all pages are sorted and displayed in alphanumerical order but this can be overridden by prefixing names with a number followed by a period, for example `1. ZZ Top.md` and `2. Abba`. This forces the page to be sorted numerically. This number prefix will always be excluded from the page's URL.

### Index pages

Many web servers, such as Apache or IIS, will look for a file named `index` when a local directory is requested and if this file is not found then they can automatically generate a list of links to the files within.

This package broadly follows this convention, files named `index.md` or `Index.md` are accessed using the folder name alone. For example, a file stored in your project as `docs/Index.md` will be assigned the path `/docs`.

Subsequently all other pages within the same directory will be considered children of the index page, allowing you to easily list and link to them.

In addition, index pages also have extra [page data](jsdoc.md#pagedata) properties which summarise any [tags and taxonomies](#tagging) used by the other pages in the directory. This taxonomy data can even be used to dynamically filter the pages by tag/s.

### Tagging

Tags enable users to filter pages so they can quickly find what they need. For example, when viewing a long list of tools it may be useful to filter them by the programming language they are designed for. Tags are defined as lists in the YAML frontmatter.

```yaml
# tags can be written as a list across multiple lines:
tags:
    - tag one
    - tag two
    - tag three

# or on a single line separated with commas:
tags: [tag one, tag two, tag three]
```

The Frontmatter properties to interpret as taxonomies can be configured with [options](jsdoc.md#Options) when initialising this package.

_Please note_ that tags are case-sensitive so `Dogs` and `dogs` will not be considered equal.

### Linking between pages

Links should work whether browsing content on GitHub, editing content locally, and when viewing the content rendered on a website. For this reason it is important to follow conventions to ensure all links work as intended across each environment.

Links between pages should be written as relative paths beginning with `./` or `../` and use the original file name of the target page, including the file extension. Here is an example:

```markdown
teams run apps on [AWS EC2](./EC2.md) and use [IAM](../4.%20Security/IAM.md) to control permissions.
```

_Please note_ that Markdown will not recognise [link destinations](https://spec.commonmark.org/0.29/#link-destination) with whitespace or line break characters so spaces in file or folder names must be [percent encoded](https://en.wikipedia.org/wiki/Percent-encoding) as `%20`.

### Embedding images

Just like links, images should work whether browsing content on GitHub, editing content locally, and when viewing content rendered on a website. Images can be uploaded to a third party service and referenced by URL or kept alongside your Markdown content and referenced locally.

```markdown
Images can be uploaded to a third party and referenced by absolute URL:

![alternative text](https://cloud.githubusercontent.com/assets/123.png)

Or stored alongside the content and referenced locally:

![alternative text](images/local-image.png)
```

### Message blocks

To highlight important or useful messages in your documentation you can use the following format to transform a blockquote into a colourful message block:

```markdown
> [TYPE] This is a very dangerous action!
```

Where `[TYPE]` can be one of the following:

-   `Inform`
-   `Success`
-   `Warning`
-   `Error`

Please refer to the [o-message demo page](https://registry.origami.ft.com/components/o-message/?brand=internal) to preview how these messages will be appear.
