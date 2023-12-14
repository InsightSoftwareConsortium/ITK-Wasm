# Migration Guide: From itk.js to ITK-Wasm

*Note: ITK-Wasm is currently in the beta development stage. The interface is relatively stable while functionality is currently being fleshed out. Updates for the rest of the documentation for changes from itk.js to ITK-Wasm is in progress. Last updated December 14th, 2023.*

**ITK-Wasm** is a major upgrade with a focus on universal, performant computing in WebAssembly. The itk.js to ITK-Wasm transition also brings improvements, including modern, elegant programming interfaces, accelerated performance, and execution beyond JavaScript thanks to [WASI](https://wasi.dev).

Most itk.js client code will simply need to update its import statements to leverage ITK-Wasm. However, there are also other more advanced changes. A description of the changes, their motivation, and example migration code can be found below.

## Module import statements

Browser module `import` statements have changed from:

```js
import IntTypes from 'itk/IntTypes'
```

to:


```js
import { IntTypes } from 'ITK-Wasm'
```

Node module import migration:

From:

```js
const IntTypes = require('itk/IntTypes.js')
```

to:

```js
import { IntTypes } from 'ITK-Wasm'
```

## TypeScript support

Typescript support was added, but, of course, you can still just use JavaScript if you wish. In ITK-Wasm, adoption of modern JavaScript constructs was extended, e.g. classes.

## Bundlers

ECMAScript Module (ESM) support is now standard.

There is now an improved approach for web workers for bundlers, CORS constraints.

## itkConfig.js removed

The `itkConfig.js` module in itk-js and initial versions of ITK-Wasm specified where to look for the io webassembly modules and an optional default base URL for pipeline modules.

This build-time approach has been replaced by a run-time configuration approach, which is much easier to specify and works transparently in a nested dependency situation.

There are now only two configuration settings.

1. The location of the web worker module.
2. The location of wasm module assets.

### Specification of the web worker module location

By default, the web worker module will be picked up by modern bundlers like Vite or WebPack without additional configuration, and the bundler will manage the location of and deployment of the bundle in a application build.

ITK-Wasm packages also contain module bundle that embed the web workers.

Finally, on an individual ITK-Wasm package scope or bundle scope via the `itk-wasm` package, the web worker can be vendored and its location at specified at runtime via `setPipelineWorkerUrl`.

### Specification of the wasm asset location

Previously, separate wasm asset locations were configured for io modules and general pipelines. Now, there is a single wasm asset configuration. It can be set on a per-package level or a common configuration for a bundle can be set.

By default, the wasm asset location is configured to use the [JsDelivr](https://www.jsdelivr.com/) CDN for a package.

On an individual ITK-Wasm package scope or bundle scope via the `itk-wasm` package, wasm assets can be vendored and their location specified at runtime via `setPipelinesBaseUrl`.

## IO modules are available in separate packages.

IO modules are now installed in separate npm packages to limit the `ITK-Wasm` package size. You can install only the packages that you need.

The io packages are:

1. `@itk-wasm/image-io`
2. `@itk-wasm/mesh-io`
3. `@itk-wasm/dicom`

An example that vendors these package's webassembly assets into an application for deployment can be found in the [Vite-based test applcation configuration](https://github.com/InsightSoftwareConsortium/itk-wasm/blob/main/packages/mesh-io/typescript/vite.config.js).

### DICOM image IO functions

The following DICOM image IO functions have been migrated to the `@ITK-Wasm/dicom` package. Their interface changed in some cases.

1. `readImageLocalDICOMFileSeries` -> `readImageDicomFileSeriesNode`
1. `readImageDICOMFileSeries` -> `readImageDicomFileSeries`
1. `readImageDICOMArrayBufferSeries` -> `readImageDicomFileSeries`
1. `readDICOMTags` -> `readDicomTags`
1. `readDICOMTagsArrayBuffer` -> `readDicomTags`
1. `readDICOMTagsLocalFile` -> `readDicomTagsNode`

## CLI options

The `--image, -i` command line option for the `build` subcommand is now a global option for all subcommands. For examples

```
ITK-Wasm build --image itkwasm/emscripten src/dir
```

is now:

```
ITK-Wasm --image itkwasm/emscripten --source-dir src/dir  build
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