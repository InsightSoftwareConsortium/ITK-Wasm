# itk.js to itk-wasm Migration Guide

*Note: this migration guide is a work in progress. itk-wasm is currently in
the alpha development stage with additional changes anticipated
into December. Also, nearly all tests in the test suite pass, but DICOM series
reading, GE and JPEG format currently have issues.*

**itk-wasm** is a major upgrade with a focus on univeral, performant computing in
WebAssembly. The itk.js to itk-wasm transition also brings improvements
including modern, elegant programming interfaces, accelerated performance,
and execution beyond JavaScript thanks to [WASI](https://wasi.dev).

Most itk.js client code will simply need to update its import statements to
leverage itk-wasm. However, there are other more advanced changes. A
description of the changes, their motivation, and example migration code can
be found below.

### Module import statements

Browser module `import` statements have changed from:

```js
import IntTypes from 'itk/IntTypes'
```

to:


```js
import { IntTypes } from 'itk'
```

Or, to help bundlers with limited tree shaking,

```js
import { IntTypes } from 'itk/browser/index.js'
```


Node module import migration:

From:

```js
const IntTypes = require('itk/IntTypes.js')
```

to:

```js
import { IntTypes } from 'itk'
```

## Typescript support

Typescript support was added, but, of course, you can still just use
JavaScript if you wish.  Uses modern JavaScript constructs when appropriate,
e.g. classes.

## Bundlers

EcmaScript Module (ESM) support was improved.

There is now an improved approach for web workers for bundlers, CORS constraints.

## IO modules are available in separate packages.

IO modules are now installed in separate npm packages to limit the `itk-wasm` package size. You can install only the packages that you need.

The version of these packages follow the `itk-wasm` package version and should be kept in sync. The io packages are:

1. `itk-image-io`
2. `itk-mesh-io`
3. `itk-polydata-io`

An example that vendors these package's webassembly assets into an application for deployment can be found in the [Webpack Example](https://github.com/InsightSoftwareConsortium/itk-wasm/tree/master/examples/Webpack).

## itkConfig.js content and usage

The `itkConfig.js` specifies where to look for the io webassembly modules and an optional default base URL for pipeline modules.

The default `itkConfig.js` is configured to use the [JsDelivr](https://www.jsdelivr.com/) CDN, but you may want to override this
default.

In the [Webpack Example](https://github.com/InsightSoftwareConsortium/itk-wasm/tree/master/examples/Webpack)
the io webassembly module assets are vendored into `/itk` directories,
this module looks like:

```js
const itkConfig = {
  webWorkersUrl: '/itk/web-workers',
  imageIOUrl: '/itk/image-io',
  meshIOUrl: '/itk/mesh-io',
  polydataIOUrl: '/itk/polydata-io',
  pipelinesUrl: '/itk/pipelines',
}

export default itkConfig
```

And it can be injected into an application bundle by setting defining `alias`'s to the configuration module for `../itkConfig.js` and `../../itkConfig.js`. For other override configuration options, see the [Webpack](https://github.com/InsightSoftwareConsortium/itk-wasm/tree/master/examples/Webpack) and Rollup (todo) examples.

### CLI options

The `--image, -i` command line option for the `build` subcommand is now a global option for all subcommands. For examples

```
itk-wasm build --image insighttoolkit/itk-wasm src/dir
```

is now:

```
itk-wasm --image --source-dir src/dir insighttoolkit/itk-wasm build
```

## Image data structure

The `itk.Image.direction` is now directly a `Float64Array` -- `itk.Matrix` has
been removed.

Addresses an important issue in image orientation support.

### Pixel type, component type identifiers

`PixelTypes`, used in `imageType.pixelType`, is now a string enumeration to make the type immediately evident in JSON serializations.

`IntTypes` and `FloatTypes` string identifiers have new string identifiers with explicit sizes.

### Image file format

The JSON file format is replaced by a WASM file format with a different
layout. A directory, ending in `.iwi` or a `.iwi.zip` file is supported.

### Node Sync functions

Node `*Sync` functions have been removed -- use the equivalent async versions instead.
