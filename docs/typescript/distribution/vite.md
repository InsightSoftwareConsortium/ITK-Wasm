# ITK-Wasm package bundled with Vite

This example demonstrates how to use an ITK-wasm package in a web browser application bundled with [Vite](https://vitejs.dev/).

Find the full example in the `ITK-Wasm/examples/vite` [directory of the GitHub repository](https://github.com/InsightSoftwareConsortium/ITK-Wasm/tree/main/examples/vite).

ITK-Wasm **asynchronously** downloads web worker JavaScript and WebAssembly Emscripten modules **on demand**. This allows the main application to load quickly, while the ITK-Wasm modules are loaded in the background when needed. It also allows the application to use only the ITK-Wasm modules that it needs, rather than loading all of them at once. Finally, computation-intensive tasks can be offloaded to web workers, which run in a separate thread from the main application, preventing the UI from freezing during long-running tasks.

A few steps are required to configure Vite to work with ITK-Wasm packages:

1. Copy ITK-Wasm Javascript and WebAssembly assets to a public directory.
2. Tell ITK-Wasm the location of the assets.
3. Prevent Vite from pre-bundling ITK-Wasm packages.

## Copy Javascript and WebAssembly assets to a public directory

In the Vite example, `vite.config.js` uses `vite-plugin-static-copy` to copy prebuilt *ITK-Wasm* pipeline assets to the `/dist` directory.

```sh
npm install @itk-wasm/image-io
npm install -D vite-plugin-static-copy
```

```js
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    // put lazy loaded JavaScript and Wasm bundles in dist directory
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/@itk-wasm/image-io/dist/pipelines/*.{js,wasm,wasm.zst}",
          dest: "pipelines/",
        },
      ],
    }),
  ],
  ...
})
```

## Tell ITK-Wasm the location of the WebAssembly assets

Call `setPipelinesBaseUrl` to tell the ITK-Wasm package where to find the WebAssembly assets. This is typically done in the main JavaScript file of your application, after importing the ITK-Wasm package.

```js
// Example ITK-Wasm package, @itk-wasm/image-io
import { readImage, setPipelinesBaseUrl } from "@itk-wasm/image-io";

// Use app-vendored WebAssembly module assets copied by viteStaticCopy
const viteBaseUrl = import.meta.env.BASE_URL || "/";
const pipelinesBaseUrl = new URL(
  `${viteBaseUrl}pipelines`,
  document.location.origin
).href;
setPipelinesBaseUrl(pipelinesBaseUrl);

[...]
  // Call the readImage function from the package
  const { image } = await readImage(files[0]);
[...]
```

## Prevent Vite from pre-bundling ITK-Wasm packages

Ensure that Vite does try to pre-bundle the ITK-Wasm packages, which can break lazy loading of the web worker and Emscripten modules. This is done by adding associated packages the `optimizeDeps.exclude` array in `vite.config.js`. This is more important when an ITK-Wasm package is a transitive dependency.

```js
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({

  // @thewtex/zstddec is used to decompress the WebAssembly modules
  optimizeDeps: {
    exclude: ["itk-wasm", "@itk-wasm/image-io", "@thewtex/zstddec"],
  },

  plugins: [
    // put lazy loaded JavaScript and Wasm bundles in dist directory
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/@itk-wasm/image-io/dist/pipelines/*.{js,wasm,wasm.zst}",
          dest: "pipelines/",
        },
      ],
    }),
  ],
});
```


## Test the example

In the [example directory](https://github.com/InsightSoftwareConsortium/ITK-Wasm/tree/main/examples/Vite):

### Development

```sh
npm install
npm start
```

And visit [http://localhost:8085/](http://localhost:8085/).

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