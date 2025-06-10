# ITK-Wasm package bundled with Webpack

This example demonstrates how to use an ITK-wasm package in a web browser application bundled with [Webpack](https://webpack.js.org/).

Find the full example in the `ITK-Wasm/examples/webpack` [directory of the GitHub repository](https://github.com/InsightSoftwareConsortium/ITK-Wasm/tree/main/examples/webpack).

Since we asynchronously download the *itk-wasm* JavaScript and WebAssembly Emscripten modules, a few extra configuration steps are required.

ITK-Wasm **asynchronously** downloads web worker JavaScript and WebAssembly Emscripten modules **on demand**. This allows the main application to load quickly, while the ITK-Wasm modules are loaded in the background when needed. It also allows the application to use only the ITK-Wasm modules that it needs, rather than loading all of them at once. Finally, computation-intensive tasks can be offloaded to web workers, which run in a separate thread from the main application, preventing the UI from freezing during long-running tasks.

A few configuration steps enhance how Webpack works with ITK-Wasm packages:

1. Copy ITK-Wasm Javascript and WebAssembly assets to a public directory.
2. Tell ITK-Wasm the location of the assets.

## Copy Javascript and WebAssembly assets to a public directory

In the Webpack example, `webpack.config.js` uses `copy-webpack-plugin` to copy prebuilt *ITK-Wasm* pipeline assets to the `/dist` directory.

```sh
npm install @itk-wasm/image-io
npm install -D copy-webpack-plugin
```

```js
[...]

import CopyPlugin from "copy-webpack-plugin";

export default {
  [...]
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "node_modules/@itk-wasm/image-io/dist/pipelines/*.{js,wasm,wasm.zst}",
          to: "pipelines/[name][ext]",
        },
      ],
    }),
  ],
  [...]
};
```

## Tell ITK-Wasm the location of the WebAssembly assets

Call `setPipelinesBaseUrl` to tell the ITK-Wasm package where to find the WebAssembly assets. This is typically done in the main JavaScript file of your application, after importing the ITK-Wasm package.

```js
// Example ITK-Wasm package, @itk-wasm/image-io
import { readImage, setPipelinesBaseUrl } from "@itk-wasm/image-io";
// Use local, vendored WebAssembly module assets copied by copy-webpack-plugin
const webpackPublicPath = __webpack_public_path__ || "/";
const pipelinesBaseUrl = new URL(
  `${webpackPublicPath}pipelines`,
  document.location.origin
).href;
setPipelinesBaseUrl(pipelinesBaseUrl);

[...]
  // Call the readImage function from the package
  const { image } = await readImage(files[0]);
[...]
```

## Test the example

In the [example directory](https://github.com/InsightSoftwareConsortium/ITK-Wasm/tree/main/examples/webpack):

### Development

```sh
npm install
npm start
```

And visit [http://localhost:8686/](http://localhost:8686/).

<video width="480" autoplay muted loop>
  <source src="../../_static/videos/vite.webm" type="video/webm">
  Sorry, your browser doesn't support embedded videos.
</video>

### Build for production and preview

```sh
npm run build
npm run preview
```

### Run Playwright end to end tests

The full example is configured for browser-based testing with the [Playwright](https://playwright.dev/) library.

```sh
npx playwright install --with-deps
npm test
```