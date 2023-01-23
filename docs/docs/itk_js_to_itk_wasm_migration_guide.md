# itk.js to itk-wasm Migration Guide

*Note: itk-wasm is currently in the beta development stage. The interface is relatively stable while functionality is currently being fleshed out. Updates for the rest of the documentation for changes from itk.js to itk-wasm is in progress. Last updated January 13th, 2023.*

**itk-wasm** is a major upgrade with a focus on universal, performant computing in WebAssembly. The itk.js to itk-wasm transition also brings improvements, including modern, elegant programming interfaces, accelerated performance, and execution beyond JavaScript thanks to [WASI](https://wasi.dev).

Most itk.js client code will simply need to update its import statements to leverage itk-wasm. However, there are also other more advanced changes. A description of the changes, their motivation, and example migration code can be found below.

## Module import statements

Browser module `import` statements have changed from:

```js
import IntTypes from 'itk/IntTypes'
```

to:


```js
import { IntTypes } from 'itk-wasm'
```

Node module import migration:

From:

```js
const IntTypes = require('itk/IntTypes.js')
```

to:

```js
import { IntTypes } from 'itk-wasm'
```

## TypeScript support

Typescript support was added, but, of course, you can still just use JavaScript if you wish. In itk-wasm, adoption of modern JavaScript constructs was extended, e.g. classes.

## Bundlers

ECMAScript Module (ESM) support was improved.

There is now an improved approach for web workers for bundlers, CORS constraints.

## IO modules are available in separate packages.

IO modules are now installed in separate npm packages to limit the `itk-wasm` package size. You can install only the packages that you need.

The version of these packages follow the `itk-wasm` package version and should be kept in sync. The io packages are:

1. `itk-image-io`
2. `itk-mesh-io`

An example that vendors these package's webassembly assets into an application for deployment can be found in the [Webpack Example](https://github.com/InsightSoftwareConsortium/itk-wasm/tree/main/examples/Webpack).

## itkConfig.js content and usage

The `itkConfig.js` specifies where to look for the io webassembly modules and an optional default base URL for pipeline modules.

The default `itkConfig.js` is configured to use the [JsDelivr](https://www.jsdelivr.com/) CDN, but you may want to override this default.

In the [Webpack Example](https://github.com/InsightSoftwareConsortium/itk-wasm/tree/main/examples/Webpack) the io webassembly module assets are vendored into `/itk` directories, this module looks like:

```js
const itkConfig = {
  pipelineWorkerUrl: '/itk/web-workers/bundles/pipeline-worker.js',
  imageIOUrl: '/itk/image-io',
  meshIOUrl: '/itk/mesh-io',
  pipelinesUrl: '/itk/pipelines',
}

export default itkConfig
```

And it can be injected into an application bundle by setting defining `alias`'s to the configuration module for `../itkConfig.js` and `../../itkConfig.js`. For other override configuration options, see the [Webpack](https://github.com/InsightSoftwareConsortium/itk-wasm/tree/main/examples/Webpack) and Rollup (todo) examples.

## CLI options

The `--image, -i` command line option for the `build` subcommand is now a global option for all subcommands. For examples

```
itk-wasm build --image itkwasm/emscripten src/dir
```

is now:

```
itk-wasm --image itkwasm/emscripten --source-dir src/dir  build
```

## Image data structure

The `itk.Image.direction` is now directly a `Float64Array` -- `itk.Matrix` has been removed.

Addresses an important issue in image orientation support.

For compatibility with vtk.js `vtkImageData`, use vtk.js [vtkITKHelper](https://kitware.github.io/vtk-js/api/Common_DataModel_ITKHelper.html) 23.4.1 or later ([vtkITKHelper.convertItkToVtkImage example](https://kitware.github.io/vtk-js/examples/ItkWasmVolume.html)).

## Pixel type, component type identifiers

`PixelTypes`, used in `imageType.pixelType`, is now a string enumeration to make the type immediately evident in JSON serializations.

`IntTypes` and `FloatTypes` string identifiers have new string identifiers with explicit sizes.

## Image file format

The JSON file format is replaced by a Wasm file format with a different layout. A directory ending in `.iwi` or a `.iwi.cbor` file is supported for images and a directory ending in `.iwm` and `.iwm.cbor` is supported for meshes and geometry data structures.

## Node Sync functions

Node `*Sync` functions have been removed -- use the equivalent async versions instead.

## VTK support

The VTK Docker images, VTK PolyData IO, `readPolyDataFile`, `readPolyDataBlob`, `readPolyDataArrayBuffer`, based on VTK were removed.

## GE image file formats

Support for the legacy GE image file formats, i.e. GE4, GE5, GEAdw, is no longer provided.

## IOTypes

The use of `IOTypes` in pipelines is deprecated and not expected to work in the future. These have been replaced by `InterfaceTypes`.

## Argument order when writing image, mesh binaries

The `useCompression` argument is now last in `writeArrayBuffer`, `writeImageArrayBuffer`, `writeImageLocalFile`, `writeMeshArrayBuffer`, `writeMeshLocalFile`.

## runPipeline

`runPipelineBrowser` was renamed to `runPipeline`.