title: Using the itk.js UMD modules from an HTML script tag
---

This example demonstrates how to use *itk.js* in a web browser application via its pre-built [UMD](https://github.com/umdjs/umd) module. This is an alternative to bundling the modules with the Webpack application, as shown in the [Webpack example](./webpack.html). In this example, we re-use the itk.js IO modules published on [unpkg.com](https://unpkg.com). Find the full example in the `itk-js/examples/UMD` [directory of the GitHub repository](https://github.com/InsightSoftwareConsortium/itk-js/tree/master/examples/UMD).

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

const entry = path.join(__dirname, './src/index.js')
const outputPath = path.join(__dirname, './dist')

const packageJSON = require('./package.json')
const itkVersion = packageJSON.dependencies.itk.substring(1)
const cdnPath = 'https://unpkg.com/itk@' + itkVersion

module.exports = {
  node: {
    fs: 'empty'
  },
  entry,
  output: {
    path: outputPath,
    filename: 'index.js',
    publicPath: cdnPath
  },
  module: {
    rules: [
      { test: entry, loader: 'expose-loader?index' },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env'] },
        },
      },
    ],
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
    ],
    alias: {
      './itkConfig$': path.resolve(__dirname, 'src', 'itkConfigCDN.js'),
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

The *itk.js* Emscripten modules are loaded and executed **asynchronously** and **on demand**. This means the client only download the content it needs and the user does not experience interruption of the main user interface thread during computation. However, a few extra configuration steps are required since the modules are not bundled by Webpack.

The Webpack [publicPath](https://webpack.js.org/guides/public-path/) setting specifies the location of static assets used by the application, and it defines `__webpack_public_path__`. We use `__webpack_public_path__` in `src/itkConfigCDN.js`:

```js
const itkConfig = {
  itkModulesPath: __webpack_public_path__
}

module.exports = itkConfig
```

Webpack is directed to use this configuration with the setting:


```js
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
    ],
    alias: {
      './itkConfig$': path.resolve(__dirname, 'src', 'itkConfigCDN.js'),
    },
  },
```

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
var packageJSON = require('./package.json')
var itkVersion = packageJSON.dependencies.itk.substring(1)
var cdnPath = '"https://unpkg.com/itk@' + itkVersion + '"'
[...]
      resolve: {
        modules: [
          path.resolve(__dirname, 'node_modules'),
          sourcePath
        ],
        alias: {
          './itkConfig$': path.resolve(__dirname, 'test', 'config', 'itkConfigTest.js')
        }
      },
      plugins: [
        new webpack.DefinePlugin({
          __ITK_MODULES_PATH__: cdnPath
        })
      ]
[...]
```

Where `itkConfigTest.js` contains:

```js
const itkConfig = {
  itkModulesPath: __ITK_MODULES_PATH__
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
