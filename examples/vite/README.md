ITK-Wasm Vite Example
=====================

This example demonstrates how to configure Vite/Rollup to build a project that
uses an [ITK-Wasm](https://wasm.itk.org/) package.

More information can be found in the [example
documentation](https://docs.itk.org/projects/wasm/en/latest/typescript/distribution/esm.html).

## Run Locally

```
npm install
npm run start
```

And visit [http://localhost:8085/](http://localhost:8085/).

## Development

```
npm install
npx playwright install --with-deps
npm test
```