# itk-wasm in a Node.js application

An `itk-convert` command line interface (CLI) example demonstrates how to use *itk-wasm* in a Node.js application. Find the full example in the `itk-wasm/examples/Node.js` [directory of the GitHub repository](https://github.com/InsightSoftwareConsortium/itk-wasm/tree/main/examples/Node.js).

This example assumes you are creating a [Node.js package](https://docs.npmjs.com/getting-started/what-is-npm). If you do not already have a `package.json` file, [create one](https://docs.npmjs.com/getting-started/using-a-package.json), first.

Add `itk-wasm` to your project's dependencies:

```sh
npm install --save itk-wasm itk-image-io itk-mesh-io
```

This adds `itk-wasm` and `itk-wasm` IO packages to the `dependencies` section of your *package.json* file:

```js
{
  "name": "itk-convert",
  "version": "1.1.0",
  "description": "Convert image or mesh files from one format to another.",
  "type": "module",
[...]
  "dependencies": {
    "commander": "^8.2.0",
    "itk-image-io": "^1.0.0-b.3",
    "itk-mesh-io": "^1.0.0-b.3",
    "itk-wasm": "^1.0.0-b.3"
  }
}
```

Next, call functions like [`readLocalFile`](/api/node_io.html) or [`writeLocalFile`](/api/node_io.html).

For example,

```js
[...]
import { readLocalFile, writeLocalFile } from 'itk-wasm'

const inputFile = program.args[0]
const outputFile = program.args[1]

try {
  const object = await readLocalFile(inputFile)
  const useCompression = true
  await writeLocalFile(object, outputFile, useCompression)
} catch (error) {
  console.error('Error during conversion:\n')
  console.error(error)
}
```
