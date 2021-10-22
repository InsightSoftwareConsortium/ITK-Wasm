title: Using itk-wasm in a Node.js application
---

An `itk-convert` command line interface (CLI) example demonstrates how to use *itk-wasm* in a Node.js application. Find the full example in the `itk-wasm/examples/Node.js` [directory of the GitHub repository](https://github.com/InsightSoftwareConsortium/itk-wasm/tree/master/examples/Node.js).

This example assumes you are creating a [Node.js package](https://docs.npmjs.com/getting-started/what-is-npm). If you do not already have a `package.json` file, [create one](https://docs.npmjs.com/getting-started/using-a-package.json), first.

Add `itk` to your project's dependencies:

```
npm install --save itk
```

This adds `itk` to the `dependencies` section of your *package.json* file:

```js
{
  "name": "itk-convert",
  "version": "1.1.0",
  "description": "Convert image or mesh files from one format to another.",
[...]
  "dependencies": {
    "commander": "^2.14.1",
    "itk": "^12.3.0"
  }
}
```

Next, call functions like [itk/readLocalFileSync](../api/node_io.html) or [itk/writeLocalFileSync](../api/node_io.html).

For example,

```js
[...]

const inputFile = program.args[0]
const outputFile = program.args[1]

try {
  const object = readLocalFileSync(inputFile);
  const useCompression = true;
  writeLocalFileSync(useCompression, object, outputFile);
} catch (error) {
  console.error('Error during conversion:\n');
  console.error(error);
}
```
