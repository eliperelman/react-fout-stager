# React FOUT Stager

Load weights and styles of typefaces in stages. Based on the techniques of
[@zachleat](https://twitter.com/zachleat)'s work on
[FOUT with Two Stage Render](https://www.zachleat.com/web/comprehensive-webfonts/).

![demo](two-stage-render.gif)

## Features

- Load multiple typefaces with weights and styles in potentially multiple stages
- Caches/optimizes repeat views per session with sessionStorage
- Receive event when all fonts have been loaded
- Works in latest browser versions

## Installation

You can install `react-fout-stager` via Yarn or npm:

```bash
# If using Yarn:
yarn add react-fout-stager

# If using npm:
npm install --save react-fout-stager
```

The core component from react-fout-stager is `FoutStager`.
This module can be required via ES imports, CommonJS require, or UMD.

```js
import FoutStager from 'react-fout-stager';

// using require
const FoutStager = require('react-fout-stager');
```

### Usage

After importing react-fout-stager, it can be rendered anywhere in the React tree. Once
react-fout-stager will mount, it will kick off loading any typefaces defined in the `stages` prop.

```jsx
import React from 'react';
import { render } from 'react-dom';
import FoutStager from 'react-fout-stager';

render((
  <FoutStager stages={[{
    className: 'font-stage-primary',
    families: [{ family: 'Roboto' }],
    stages: [{
      className: 'font-stage-secondary',
      families: [
        { family: 'RobotoBold', options: { weight: 700 } },
        { family: 'RobotoItalic', options: { style: 'italic' } },
        { family: 'RobotoBoldItalic', options: { weight: 700, style: 'italic' } }
      ]
    }]
  }]} />
), document.getElementById('root'));
```

If you pass any children to `FoutStager`, they will not be rendered until the typefaces have all loaded.

```jsx
import React from 'react';
import { render } from 'react-dom';
import FoutStager from 'react-fout-stager';

render((
  <FoutStager stages={[{
    className: 'font-stage-primary',
    families: [{ family: 'Roboto' }],
    stages: [{
      className: 'font-stage-secondary',
      families: [
        { family: 'RobotoBold', options: { weight: 700 } },
        { family: 'RobotoItalic', options: { style: 'italic' } },
        { family: 'RobotoBoldItalic', options: { weight: 700, style: 'italic' } }
      ]
    }]
  }]}>
    <em>I won't render until all these "Roboto" typefaces have loaded!</em>
  </FoutStager>
), document.getElementById('root'));
```

### Props

`FoutStager` accepts a few props to customize its behavior:

| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| `stages` | `arrayOf(stage)` | ✓ | A list of stages with associated typefaces to load. |
| `sessionKey` | `string` |  | The sessionStorage key which is used to cache typeface loads. Defaults to `foutStagerLoaded`. This will need to be overridden if you use multiple `FoutStager`s in an application. |
| `onStagesLoad` | `func` |  | Execute a function when all typefaces have loaded. |
| `children` | `node` |  | Render children when all typefaces have loaded. |

#### stages

The `stages` prop of `FoutStager` accepts an array of stages. The shape of a stage is:

```js
Stage :: {
  className: string.isRequired,
  families: arrayOf(shape({
    family: string.isRequired,
    options: object
  })).isRequired,
  stages: arrayOf(Stage)
}
```

Or said more verbosely:

- Each stage is an object.
- A stage must include a property named `className` which is a `string` class name to place on the
`html` tag when the stage has loaded.
- A stage must include a property named `families` which is an array of objects, each of which
represents a typeface (font family) to load in this stage.
- Each family in `families` must include a property named `family` which corresponds to a
`font-family` defined in CSS. Creating font families is detailed below.
- Each family in `families` can optionally include a property named `options`, which is an object
that defines a font description with properties of `weight`, `style`, and `stretch`.
These accept values that are defined by the [`fontfaceobserver`](https://fontfaceobserver.com/) library.
- A stage can also include a property named `stages`, which is another array of stages to load once the
current stage has completed.

All adjacent stages are loaded in parallel. The use of the `stages` property on a stage should be use
for loading stages serially.

### CSS

In order to load typefaces with `FoutStager`, they need to have a defined `font-family` in CSS.
For example, here is a `@font-face` with a `font-family` defined for the Roboto (Regular) typeface:

```css
@font-face {
  font-family: Roboto;
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  src:
    local('Roboto Regular'),
    local('Roboto Regular '),
    local('Roboto-Regular'),
    url('~typeface-roboto/files/roboto-latin-400.woff2') format('woff2'),
    url('~typeface-roboto/files/roboto-latin-400.woff') format('woff');
}
```

Take note of the `font-family: Roboto` property. This is how you will reference this particular
font in `FoutStager`:

```jsx
<FoutStager stages={[{
  className: 'font-stage-primary',
  families: [{ family: 'Roboto' }]
}]} />
```

Loading variants of a typeface should have their own `font-family` name. For example, to define
the Roboto Italic font:

```css
@font-face {
  font-family: RobotoItalic;
  font-style: italic;
  font-display: swap;
  font-weight: 400;
  src:
    local('Roboto Regular italic'),
    local('Roboto-Regularitalic'),
    url('~typeface-roboto/files/roboto-latin-400italic.woff2') format('woff2'),
    url('~typeface-roboto/files/roboto-latin-400italic.woff') format('woff');
}
```

```jsx
<FoutStager stages={[{
  className: 'font-stage-primary',
  families: [{ family: 'RobotoItalic', options: { style: 'italic' } }]
}]} />
```

Notice the use of `options` when loading fonts with non-normal font descriptions.


### Example

For a canonical example, we are going to replicate
[Zach Leatherman's FOFT, or FOUT with Two Stage Render](https://www.zachleat.com/web-fonts/demos/foft.html)
demo in React.

<small>
Note: We are loading our CSS from JS using, but this isn't required.
</small>

```css
@font-face {
  font-family: Lato;
  src:
    url('/files/lato-regular-webfont.woff2') format('woff2'),
    url('/files/lato-regular-webfont.woff') format('woff');
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: LatoBold;
  src:
    url('/files/lato-bold-webfont.woff2') format('woff2'),
    url('/files/lato-bold-webfont.woff') format('woff');
  font-weight: 700;
  font-style: normal;
}
@font-face {
  font-family: LatoItalic;
  src:
    url('/files/lato-italic-webfont.woff2') format('woff2'),
    url('/files/lato-italic-webfont.woff') format('woff');
  font-weight: 400;
  font-style: italic;
}
@font-face {
  font-family: LatoBoldItalic;
  src:
    url('/files/lato-bolditalic-webfont.woff2') format('woff2'),
    url('/files/lato-bolditalic-webfont.woff') format('woff');
  font-weight: 700;
  font-style: italic;
}

/*
  The purpose of defining class stages is to
  re-render once a stage has been met. We start
  with the minimal default stage of sans-serif,
  and progressively re-render.
*/
body {
  font-family: sans-serif;
}

/*
  The defined stages now modify the display of
  elements once they are loaded.
*/

/*
  During stage 1 we only load the Lato font.
  Once it's loaded, update the body to use it.
*/
.fonts-stage-1 body {
  font-family: Lato, sans-serif;
  font-weight: 400;
  font-style: normal;
}

/*
  During stage 2 we load Lato Bold, Lato Italic, and
  Lato Bold Italic. Once these 3 are loaded, we can
  once again update relevant elements to render using
  these fonts.
*/
.fonts-stage-2 h1, .fonts-stage-2 strong {
  font-family: LatoBold, sans-serif;
  font-weight: 700;
}
.fonts-stage-2 em {
  font-family: LatoItalic, sans-serif;
  font-style: italic;
}
.fonts-stage-2 strong em,
.fonts-stage-2 em strong {
  font-family: LatoBoldItalic, sans-serif;
  font-weight: 700;
  font-style: italic;
}
```

```jsx
import React from 'react';
import { render } from 'react-dom';
import FoutStager from 'react-fout-stager';
import './lato-family.css';

render((
  <div>
    <h1>FOFT, or FOUT with Two Stage Render</h1>
    <p>
      This is a paragraph.
      <strong> This is heavier text.</strong>
      <em> This is emphasized text.</em>
      <strong><em> This is heavier and emphasized text.</em></strong>
    </p>
    <FoutStager
      stages={[{
        className: 'fonts-stage-1',
        families: [{ family: 'Lato' }],
        stages: [{
          className: 'fonts-stage-2',
          families: [
            { family: 'LatoBold', options: { weight: 700 } },
            { family: 'LatoItalic', options: { style: 'italic' } },
            { family: 'LatoBoldItalic', options: { weight: 700, style: 'italic' } }
          ]
        }]
      }]} />
  </div>
)), document.getElementById('root'));
```

## Development and Contributing

This repository uses [Neutrino](https://neutrino.js.org) and [neutrino-preset-react-components](https://github.com/eliperelman/neutrino-preset-react-components/)
for developing, previewing, and building React components. To get started:

- Fork and clone this repo.
- Install the dependencies with `yarn`.
- Start the development servers with `yarn start`.
- Use CTRL-C to exit the development server.
- Use `yarn build` to generate the compiled component for publishing to npm.

Feel free to open an issue, submit a pull request, or contribute however you would like. Understand that this
documentation is still a work in progress, so file an issue or submit a PR to ask questions or make improvements.
Thanks!
