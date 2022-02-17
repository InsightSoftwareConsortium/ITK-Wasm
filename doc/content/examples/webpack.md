title: Using itk-wasm in a web browser application via Webpack
---

This example demonstrates how to use *itk-wasm* in a web browser application built with [Webpack](https://webpack.js.org/). Find the full example in the `itk-wasm/examples/Webpack` [directory of the GitHub repository](https://github.com/InsightSoftwareConsortium/itk-wasm/tree/master/examples/Webpack).

Since we asynchronously download the *itk-wasm* JavaScript and WebAssembly Emscripten modules, a few extra configuration steps are required.

This example assumes you are creating a [Node.js package](https://docs.npmjs.com/getting-started/what-is-npm). If you do not already have a `package.json` file, [create one](https://docs.npmjs.com/getting-started/using-a-package.json), first.

Add `itk-wasm` and the io-packages to your project's dependencies:

```
npm install --save itk-wasm itk-image-io itk-mesh-io itk-polydata-io
```

Then, install Webpack-related development dependencies:

```
npm install --save-dev webpack webpack-cli webpack-dev-server worker-loader babel-loader '@babel/preset-env' '@babel/core' copy-webpack-plugin
```

Next, create a `webpack.config.js` file like the following:

```js
const path = require('path')

const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')

const entry = path.join(__dirname, 'src', 'index.js')
const outputPath = path.join(__dirname, './dist')
const itkConfig = path.resolve(__dirname, 'src', 'itkConfig.js')

module.exports = {
  entry,
  output: {
    path: outputPath,
    filename: 'index.js',
    library: {
      type: 'umd',
      name: 'bundle',
    },
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader' }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'node_modules', 'itk-wasm', 'dist', 'web-workers'),
          to: path.join(__dirname, 'dist', 'itk', 'web-workers')
        },
        {
          from: path.join(__dirname, 'node_modules', 'itk-image-io'),
          to: path.join(__dirname, 'dist', 'itk', 'image-io')
        },
        {
          from: path.join(__dirname, 'node_modules', 'itk-polydata-io'),
          to: path.join(__dirname, 'dist', 'itk', 'polydata-io')
        },
        {
          from: path.join(__dirname, 'node_modules', 'itk-mesh-io'),
          to: path.join(__dirname, 'dist', 'itk', 'mesh-io')
        }
    ]})
  ],
  resolve: {
    fallback: { fs: false, path: false, url: false, module: false },
    alias: {
      '../itkConfig.js': itkConfig,
      '../../itkConfig.js': itkConfig,
    },
  },
  performance: {
    maxAssetSize: 10000000
  }
}
```

Replace `src/index.js` by your [Webpack entry point](https://webpack.js.org/concepts/#entry). Replace `./dist/` and the output filename with where you [want Webpack to place the generated JavaScript bundle](https://webpack.js.org/concepts/#output).


The [babel-loader](https://github.com/babel/babel-loader) rule will [transpile](https://scotch.io/tutorials/javascript-transpilers-what-they-are-why-we-need-them) JavaScript from the latest language syntax to a syntax supported by existing browser clients. Configure the target browsers to support with a `.babelrc` file like the following:

```js
{
  presets: [
    ['@babel/preset-env', {
      targets: {
        browsers: ['last 2 versions'],
      },
    }],
  ],
}
```

The *itk-wasm* Emscripten modules are loaded and executed **asynchronously** and **on demand**. This means the client only download the content it needs and the user does not experience interruption of the main user interface thread during computation. However, a few extra configuration steps are required since the modules are not bundled by Webpack.

The `CopyPlugin` copies *itk-wasm* Emscripten modules to distribute along with your Webpack bundle. In this example, we copy all *image-io*, and *mesh-io*, and *polydata-io*. In your project, you may want to copy only the *image-io* or a subset of the *image-io*, based on your needs. We also copy the *web-workers*, which asynchronously perform IO or run processing pipelines in a background thread.

To change the location of the *itk-wasm* web worker and Emscripten modules, set the Webpack `resolve.alias` setting as described in the Karma configuration below.

Next, define commands to build the project or build the project and start a local development web server in the *scripts* section of the `package.json` file,

```js
  "scripts": {
    "build": "webpack --progress --colors -p",
    "start": "webpack-dev-server --content-base ./dist/ --watch-content-base"
  },
```

Build the project with

```
npm run build
```

To start the development web server, run

```
npm run start
```

## Testing with Karma

This section described how to configure browser-based testing with the [Karma test runner](https://karma-runner.github.io/2.0/index.html).

First, install Karma and a test harness library like [tape](https://github.com/substack/tape).

```
npm install --save-dev karma karma-chrome-launcher karma-tap karma-tap-pretty-reporter karma-webpack tape tap-spec
```

Next write a `karma.config.js` file. The *itk-wasm* specific sections of this
file are:

```js
[...]
    files: [
      './test/index.js',
      { pattern: './dist/itk/image-io/**', watched: true, served: true, included: false },
      { pattern: './dist/itk/mesh-io/**', watched: true, served: true, included: false },
      { pattern: './dist/itk/polydata-io/**', watched: true, served: true, included: false },
      { pattern: './dist/itk/web-workers/**', watched: true, served: true, included: false }
    ],
[...]
```

Here, `./test/index.js` can be replaced by the path to your testing module. We also serve the *itk-wasm* Emscripten and web worker files with Karma's web server.

Since Karma's web server serves its files in `/base` by default, and our files are also in the `./dist/itk` directory, we can tell Webpack to use a different path for the *itk-wasm* modules when building for Karma tests with:

```js
[...]
    webpack: {
[...]
      resolve: {
        alias: {
          '../itkConfig.js': path.resolve(__dirname, 'test', 'config', 'itkConfigTest.js'),
          '../../itkConfig.js': path.resolve(__dirname, 'test', 'config', 'itkConfigTest.js'),
        },
        fallback: { fs: false, path: false, buffer: false, url: false, module: false },
      },
      plugins: [
        new webpack.DefinePlugin({
          __BASE_PATH__: "'/base'"
        }),
        new webpack.ProvidePlugin({ process: ['process/browser'] }),
      ]
[...]
```

Where `itkConfigTest.js` contains:

```js
const itkConfig = {
  webWorkersUrl: __BASE_PATH__ + '/dist/itk/web-workers',
  imageIOUrl: __BASE_PATH__ + '/dist/itk/image-io',
  meshIOUrl: __BASE_PATH__ + '/dist/itk/mesh-io',
  polydataIOUrl: __BASE_PATH__ + '/dist/itk/polydata-io',
  pipelinesUrl: __BASE_PATH__ + '/dist/itk/pipelines',
}

export default itkConfig
```

Create entries in the `package.json` file to start Karma, and run the tests!

```js
  "scripts": {
    "build": "webpack --progress --colors -p",
    "start": "webpack-dev-server --mode development --content-base ./dist/ --watch-content-base",
    "test": "karma start ./karma.conf.js",
    "test:debug": "karma start ./karma.conf.js --no-single-run"
  },
```

and

```
npm run test
```
