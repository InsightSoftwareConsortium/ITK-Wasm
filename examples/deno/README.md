itk-convert
===========

Convert an image or mesh from one file format to another.

This example [deno](https://docs.deno.com) package provides a command line executable, `itk-convert` to convert
image file formats with
[ITK-Wasm](https://github.com/InsightSoftwareConsortium/ITK-Wasm.git).

## Installation

```
deno install
```

## Usage

```
deno src/itk-convert.ts <inputFile> <outputFile>
```

## Development

```
deno task test
```

## More Information

This example demonstrates how to use
[ITK-Wasm](https://wasm.itk.org/) in a Node.js
application. More information can be found in the [example
documentation](https://docs.itk.org/projects/wasm/en/latest/typescript/distribution/deno.html).
