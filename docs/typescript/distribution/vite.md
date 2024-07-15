# ITK-Wasm in a web browser application via Vite

This example demonstrates how to use *ITK-Wasm* in a web browser application built with [Vite](https://vitejs.dev/). Find the code in [itk-wasm/examples/Vite](https://github.com/InsightSoftwareConsortium/ITK-Wasm/tree/main/examples/Vite).

*ITK-Wasm* **asynchronously** downloads web worker JavaScript and WebAssembly Emscripten modules **on demand**.  For *ITK-Wasm* to work:

* Copy *ITK-Wasm* Javascript and WebAssembly files to a public directory
* Tell *ITK-Wasm* the location to download the Javascript and WebAssembly files in the public directory

## Copy *ITK-Wasm* Javascript and WebAssembly files to a public directory

In the Vite example, `vite.config.js` uses `vite-plugin-static-copy` to move prebuilt *ITK-Wasm* files to the `/dist` directory.

```javascript
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    // put lazy loaded JavaScript and Wasm bundles in dist directory
    viteStaticCopy({
      targets: [
        { src: 'node_modules/itk-wasm/dist/web-workers/*', dest: 'dist/itk/web-workers' },
        {
          src: 'node_modules/itk-image-io/*',
          dest: 'dist/itk/image-io',
        },
        {
          src: 'node_modules/itk-mesh-io/*',
          dest: 'dist/itk/mesh-io',
          rename: 'mesh-io'
        }
      ],
    })
  ],
  ...
})
```

The Vite config copies *web-workers* directory, which asynchronously perform IO or runs processing pipelines in a background thread.

The config copies the complete *image-io* and *mesh-io* directories. You may want to copy a subset of *image-io* or *mesh-io* files, based on what features you use of *ITK-Wasm*.

## Tell *ITK-Wasm* the location to download the Javascript and WebAssembly files

To change the location of the *ITK-Wasm* web worker and Emscripten modules, configure Vite's `resolve.alias` setting.

```javascript
import { defineConfig } from 'vite'
import path from 'path'

const itkConfig = path.resolve(__dirname, 'src', 'itkConfig.js')

export default defineConfig({
  ...
  resolve: {
    // where itk-wasm code has 'import ../itkConfig.js` point to the path of itkConfig
    alias: {
      '../itkConfig.js': itkConfig,
      '../../itkConfig.js': itkConfig
    }
  }
})
```

The itkConfig.js file holds paths where *ITK-Wasm* fetches assets at runtime.

```javascript
const itkConfig = {
  pipelineWorkerUrl: '/itk/web-workers/min-bundles/pipeline.worker.js',
  imageIOUrl: '/itk/image-io',
  meshIOUrl: '/itk/mesh-io',
  pipelinesUrl: '/itk/pipelines'
}

export default itkConfig
```

## Test the example

In the example [directory](https://github.com/InsightSoftwareConsortium/ITK-Wasm/tree/main/examples/Vite)

### Development

```sh
npm install
npm run start
```
And visit [http://localhost:8080/](http://localhost:8080/).

### Test static bundled assets

```sh
npm run build
npm run start:production
```

### Run Cypress end to end tests

```sh
npm run build
npm run test
```