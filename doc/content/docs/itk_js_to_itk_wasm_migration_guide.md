# itk.js to itk-wasm Migration Guide

**This is a work in progress.**

itk-wasm is a major upgrade that ...

Typescript support was added, but, of course, you can still just use
JavaScript if you wish.  Uses modern JavaScript constructs when appropriate,
e.g. classes.

Improved approach for web workers for bundlers, CORS constraints.

Addresses an important issue in image orientation support.

## IO modules are available in separate packages.

IO modules are now installed in separate npm packages to limit the `itk-wasm`
package size. You can install only the packages that you need.

The version of these packages follow the `itk-wasm` package version and should
be kept in sync. The io packages are:

1. `itk-image-io`
2. `itk-mesh-io`
3. `itk-polydata-io`

An example that vendors these package's webassembly assets into an
application for deployment can be found in the [Webpack
Example](https://github.com/InsightSoftwareConsortium/itk-wasm/tree/master/examples/Webpack).

## itkConfig.js content and usage

The `itkConfig.js` specifies where to look for the io webassembly modules and
an optional default base URL for pipeline modules.

The default `itkConfig.js` is configured to use the
[JsDelivr](https://www.jsdelivr.com/) CDN, but you may want to override this
default.

In the [Webpack
Example](https://github.com/InsightSoftwareConsortium/itk-wasm/tree/master/examples/Webpack)
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

And it can be injected into an application bundle by setting defining
`alias`'s to the configuration module for `../itkConfig.js` and
`../../itkConfig.js`. For other override configuration options, see the Webpack (todo),
Rollup (todo), and Unpkg (todo) examples.


### Browser module import migration

From:

```
import IntTypes from 'itk/IntTypes'
```

to:


```
import { IntTypes } from 'itk'
```

Or, to help bundlers with limited tree shaking,

```
import { IntTypes } from 'itk/browser/index.js'
```


Node module import migration:

From:

```
const IntTypes = require('itk/IntTypes.js')
```

to:

```
import { IntTypes } from 'itk'
```

Node `*Sync` functions have been removed -- use the async versions instead.
