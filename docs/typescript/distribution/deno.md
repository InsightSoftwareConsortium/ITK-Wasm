# ITK-Wasm in a Deno application

An `itk-convert` command line interface (CLI) example demonstrates how to use ITK-Wasm in a Deno application. Find the full example in the `ITK-Wasm/examples/deno` [directory of the GitHub repository](https://github.com/InsightSoftwareConsortium/ITK-Wasm/tree/main/examples/deno).

This example assumes you are creating a [Deno project](https://docs.deno.com/runtime/fundamentals/configuration/). If you do not already have a `deno.json` file, [create one](https://docs.deno.com/runtime/fundamentals/configuration/) first.

Add packages to your project's imports:

```json
{
  "imports": {
    "@itk-wasm/image-io": "npm:@itk-wasm/image-io",
    "@itk-wasm/mesh-io": "npm:@itk-wasm/mesh-io",
    "itk-wasm": "npm:itk-wasm"
  }
}
```

This adds `itk-wasm` and ITK-Wasm IO packages to the `imports` section of your *deno.json* file:

```json
{
  "name": "itk-convert",
  "version": "1.0.0",
  "description": "Convert image or mesh files from one format to another.",
  "exports": "./src/itk-convert.ts",
  "tasks": {
    "test": "deno run --allow-read --allow-write src/itk-convert.ts ../../docs/_static/logo.png ./logo.tif"
  },
  "imports": {
    "@itk-wasm/image-io": "npm:@itk-wasm/image-io",
    "@itk-wasm/mesh-io": "npm:@itk-wasm/mesh-io",
    "itk-wasm": "npm:itk-wasm@1.0.0-b.188"
  },
  "compilerOptions": {
    "strict": true
  }
}
```

Next, call functions like [`readImageNode`](https://itk-wasm-image-io-docs-js.on.fleek.co/#/?id=readimagenode) or [`writeImageNode`](https://itk-wasm-image-io-docs-js.on.fleek.co/#/?id=writeimagenode).

For example,

```typescript
import { readImageNode, writeImageNode } from '@itk-wasm/image-io'
import { readMeshNode, writeMeshNode, extensionToMeshIo } from '@itk-wasm/mesh-io'
import { getFileExtension } from 'itk-wasm'

const extension = getFileExtension(inputFile).toLowerCase()
const isMesh = extensionToMeshIo.has(extension)

try {
  if (isMesh) {
    const mesh = await readMeshNode(inputFile)
    await writeMeshNode(mesh, outputFile)
  } else {
    const image = await readImageNode(inputFile)
    await writeImageNode(image, outputFile)
  }
} catch (error) {
  console.error('Error during conversion:\n')
  console.error(error)
}
```
