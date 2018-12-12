title: Using itk.js in a web browser application via Webpack
---

This example demonstrates how to use *itk.js* in a web browser application built with [Webpack](https://webpack.js.org/). Find the full example in the `itk-js/examples/Webpack` [directory of the GitHub repository](https://github.com/InsightSoftwareConsortium/itk-js/tree/master/examples/Webpack).

Since we asynchronously download the *itk.js* JavaScript and WebAssembly Emscripten modules, a few extra configuration steps are required.

This example assumes you are creating a [Node.js package](https://docs.npmjs.com/getting-started/what-is-npm). If you do not already have a `package.json` file, [create one](https://docs.npmjs.com/getting-started/using-a-package.json), first.

Add `itk` to your project's dependencies:

```
npm install --save itk
```

Then, install Webpack-related development dependencies:

```
npm install --save-dev webpack webpack-cli webpack-dev-server worker-loader babel-loader '@babel/preset-env' '@babel/core'
```

Next, create a `webpack.config.js` file like the following:

```js
const path = require('path')

const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')

const entry = path.join(__dirname, './src/index.js')
const outputPath = path.join(__dirname, './dist')

module.exports = {
  node: {
    fs: 'empty',
  },
  entry,
  output: {
    path: outputPath,
    filename: 'index.js',
  },
  module: {
    rules: [
      { test: entry, loader: 'expose-loader?index' },
      { test: /\.js$/, loader: 'babel-loader' },
    ]
  },
  plugins: [
    new CopyPlugin([
      {
      from: path.join(__dirname, 'node_modules', 'itk', 'WebWorkers'),
      to: path.join(__dirname, 'dist', 'itk', 'WebWorkers'),
      },
      {
      from: path.join(__dirname, 'node_modules', 'itk', 'ImageIOs'),
      to: path.join(__dirname, 'dist', 'itk', 'ImageIOs'),
      },
      {
      from: path.join(__dirname, 'node_modules', 'itk', 'MeshIOs'),
      to: path.join(__dirname, 'dist', 'itk', 'MeshIOs'),
      },
    ]),
  ],
  performance: {
      maxAssetSize: 10000000
  },
};
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

The *itk.js* Emscripten modules are loaded and executed **asynchronously** and **on demand**. This means the client only download the content it needs and the user does not experience interruption of the main user interface thread during computation. However, a few extra configuration steps are required since the modules are not bundled by Webpack.

The `CopyPlugin` copies *itk.js* Emscripten modules to distribute along with your Webpack bundle. In this example, we copy all *ImageIOs* and *MeshIOs*. In your project, you may want to copy only the *ImageIOs* or a subset of the *ImageIOs*, based on your needs. We also copy the *WebWorkers*, which asynchronously perform IO or run processing pipelines in a background thread.

To change the location of the *itk.js* web worker and Emscripten modules, set the Webpack `resolve.alias` setting as described in the Karma configuration below.

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

Next write a `karma.config.js` file. The *itk.js* specific sections of this
file are:

```js
[...]
    files: [
      './test/index.js',
      { pattern: './dist/itk/ImageIOs/**', watched: true, served: true, included: false },
      { pattern: './dist/itk/MeshIOs/**', watched: true, served: true, included: false },
      { pattern: './dist/itk/WebWorkers/**', watched: true, served: true, included: false },
    ],
[...]
```

Here, `./test/index.js` can be replaced by the path to your testing module. We also serve the *itk.js* Emscripten and web worker files with Karma's web server.

Since Karma's web server serves its files in `/base` by default, and our files are also in the `./dist/itk` directory, we can tell Webpack to use a different path for the *itk.js* modules when building for Karma tests with:

```js
[...]
    webpack: {
[...]
      resolve: {
        alias: {
          './itkConfig$': path.resolve(__dirname, 'test', 'config', 'itkConfigTest.js'),
        },
      },
      plugins: [
        new webpack.DefinePlugin({
          __BASE_PATH__: "'/base'"
        })
      ]
[...]
```

Where `itkConfigTest.js` contains:

```js
const itkConfig = {
  itkModulesPath: __BASE_PATH__ + '/dist/itk'
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
