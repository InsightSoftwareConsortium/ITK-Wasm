# itk-wasm 15 Migration Guide

**This is a work in progress.**

itk-wasm is a major upgrade that ...

Typescript support was added, but, of course, you can still just use
JavaScript if you wish.
Uses modern JavaScript constructs when appropriate, e.g. classes.
EcmaScript 2020 Modules

Improved approach for web workers for bundlers, CORS constraints.
Workers will work transparently with the [Webpack 5 Web
Worker](https://webpack.js.org/guides/web-workers/) support.

Addresses an import issue in image orientation support.
IO modules are available in separate packages.

Browser module import migration:

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
