ITK-Wasm ESM Example
====================

This example demonstrates how to use the
[ITK-Wasm](https://wasm.itk.org/) ESM module from
a an HTML script tag for access to the image and mesh IO module that are
distributed on the [jsDelivr](https://www.jsdelivr.com/) [content delivery
network](https://en.wikipedia.org/wiki/Content_delivery_network).

More information can be found in the [example
documentation](https://docs.itk.org/projects/wasm/en/latest/typescript/distribution/esm.html).

## Run Locally

```
npm install
npm run start
```

And visit [http://localhost:8080/](http://localhost:8080/).

## Development

```
npm install
npx playwright install --with-deps
npm test
```
