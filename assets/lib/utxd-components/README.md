# UTxD Design System Web Components

This repository contains the elements, foundations, and components that make up the UTxD Design System. It is meant to be imported into a parent project as a [git submodule](https://git-scm.com/docs/git-submodule).

## Installation

1. Change directory to desired location for the components library within the local repository of your parent project (e.g. `/static/lib/`)
2. Add this repository as a submodule: `git submodule add ssh://git@stash.hugeinc.com:7999/utc/utxd-components.git`
3. This will create a hidden `.gitmodules` config file as well as the `utxd-components` directory. Commit these changes.
4. Compile the components library's files and link to your project (see below)

## Initialization

When project collaborators first pull down the parent repository to their local systems, the submodule must be initialized and updated:

1. `git submodule init` - registers the origin repository path to the local location of the submodule
2. `git submodule update` - downloads submodule files at specified commit

This can also be done with a single `git submodule update --init` command.

## Versioning

Updates to the components library are specified via [git tags](https://git-scm.com/book/en/v2/Git-Basics-Tagging) on commits to the `master` branch, using [semantic versioning](http://semver.org/). To update the library in your parent project:

1. `cd` into the root of the submodule
2. `git fetch --tags` to download the available versions
3. `git tag -l` to list available tags
4. `git checkout <tag-name>` to checkout a version, e.g. `git checkout v0.1.0`
5. `cd ../` back into your parent project
6. `git commit` the update to the submodule reference

It is important to understand that a submodule's contents will not be stored in your parent repository. Instead, you are committing a reference to the SHA1 hash referring to a commit in the submodule repository. Other collaborators or environments will then locally download the files, at that commit, via the `git update` command.

You can experiment with modifying files within the submodule, or even creating new branches and committing changes for future PRs to the components library itself. To restore the submodule to the committed tag/commit, simply run `git submodule update --init`.

## Compiling the components

The library utilizes [SASS](http://sass-lang.com/) to compile the final CSS. The SASS files can be found in [/src/sass](./src/sass) and are broken down into categories. To import the entire design system components CSS, import the root manifest into your project's SASS file:

```
@import '<path to submodule>/utxd-components/src/sass/utxd-components';
```

Each sub-directory within `/src/sass/` contains an `_index.scss` manifest partial. This allows you to pick and choose which components you need for your project. However, it is recommended that you *always* import the `global` manifest as a key dependency. This includes a normalizer and some top-level element style resets (such as utilizing border-box box-sizing for all elements).

For example, if you only wanted the grid classes, you could import them into your project's SASS like so:

```
@import '<path to submodule>/utxd-components/src/sass/utxd-components/global/index';
@import '<path to submodule>/utxd-components/src/sass/utxd-components/foundations/grid/index';
```

### Fonts

Fonts are licensed through [fonts.com](http://fonts.com) and self-hosted in this repository. Because font paths are relative to the location of the compiled CSS file, we cannot specify the final path in the SASS.

Instead, a [$fonts-path](./src/sass/foundations/typography/_variables.scss#1) variable is provided to customize the final location of your project's font files. In the library, this is set to `../fonts` for usage in the [examples](./examples) static site. Using the [!default](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#variable_defaults_) flag allows you to set your own value before importing the components library SASS.

In your project, set this variable before importing the components library SASS, like so:

```
$fonts-path: '<relative path to fonts from compiled CSS>';
@import '<path to submodule>/utxd-components/src/sass/utxd-components';
```

### SVG Sprite

The components library uses SVG (scalable vector graphics) format for icons and logos. A sprite is compiled using the [Gulp SVG Sprite](https://github.com/jkphl/gulp-svg-sprite) library at [dist/svg/utxd-sprite.svg](./dist/svg/utxd-sprite.svg), while the individual images live in [src/svg](./src/svg). Using a sprite allows us to easily render SVG images inline while applying CSS styles, such as fill colors.

To use the sprite in your project, inject the contents of `utxd-sprite.svg` into your markup files/templates, preferably as close to the opening `<body>` tag as possible. The examples HTML included in this repository use [gulp-inject](https://stash.hugeinc.com/projects/UTC/repos/utxd-components/browse/gulpfile.js#82-89), but your solution may vary depending upon your website's tech stack.

The sprite only needs to be included once per page. To hide the sprite from your users, you can wrap the SVG code in a `<div>` styled with `display: none;` or positioned off-screen.

Individual icons/logos can then be rendered using the IDs pulled from the invididual file names. For example, to render an `info-heavy` icon:

```
<svg>
  <use xlink:href="#info-heavy"></use>
</svg>
```

Styles can then be applied via classes added to the `<svg>` elements. For example:

```
// CSS
.red {
  fill: #f00;
}

// HTML
<svg class="red">
  <use xlink:href="#info-heavy"></use>
</svg>
```

We also provide `.icon` and `.logo` classes, with several modifiers, in the components library SASS. See the [iconography](./examples/foundations/iconography.html) and [logos](./examples/foundations/logos.html) example pages for usage.
