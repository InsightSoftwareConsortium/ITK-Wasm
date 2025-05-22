# ITK-Wasm ESM module from an HTML script tag

This example demonstrates how to use an ITK-Wasm package in a web browser application via its pre-built [ECMAScript Module (ESM)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).

This is an alternative to bundling the modules with a bundler like Vite or ESBuild or using the package directly in a runtime like Node.js or Deno. In this example, we use an ITK-Wasm IO modules published on [NPM](https://npmjs.com), which is indexed by the [jsdelivr.com](https://jsdelivr.com) Content Delivery Network (CDN).

Find the full example in the `ITK-Wasm/examples/esm` [directory of the GitHub repository](https://github.com/InsightSoftwareConsortium/ITK-Wasm/tree/main/examples/esm).

----

Inside a JavaScript ESM `<script type="module">` tag, load the desired function from the ITK-Wasm package's ESM:

```html
  <script type="module">
    [...]
    import { readImage } from "https://cdn.jsdelivr.net/npm/@itk-wasm/image-io@1.6.0/dist/bundle/index-worker-embedded.min.js";
```

The `dist/bundle/index-worker-embedded.min.js` file is a pre-built, minified ESM module that contains the ITK-Wasm package's JavaScript code with the associated Web Worker script embedded. The `@itk-wasm/image-io` package is an example of an ITK-Wasm IO module that can read images.

Inside body JavaScript code, use the imported function to read an image from a file input element:

```js
  [...]
  const { image } = await readImage(files[0]);
```

These JavaScript ITK-Wasm components are used by the HTML, CSS, and JavaScript of [the full example](https://github.com/InsightSoftwareConsortium/ITK-Wasm/blob/main/examples/esm/dist/index.html).

## Simple HTTP server

Optionally, add an npm script that will start a local web server for development.

```shell
npm init -y
npm install --save-dev http-server
```

Next, define a `start` command to start a local development web server in the *scripts* section of the `package.json` file,

```js
  "scripts": {
    "start": "http-server -c-1 ./dist/"
  },
```

To start the development web server hosting the `./dist/` directory contents, run

```sh
npm run start
```

<video width="480" autoplay muted loop>
  <source src="../../_static/videos/esm.webm" type="video/webm">
  Sorry, your browser doesn't support embedded videos.
</video>

## Testing with Playwright

The full example is configured for browser-based testing with the [Playwright](https://playwright.dev/) library.

To run the tests, first install Playwright,

```sh
npm install
npx playwright install --with-deps
```

Then run the tests:

```sh
npm run test
```