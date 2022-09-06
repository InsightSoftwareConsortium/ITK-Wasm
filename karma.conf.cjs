/* eslint-disable global-require */
/* eslint-disable react/require-extension */
const os = require('os')
const path = require('path')
const webpack = require('webpack')
const sourcePath = path.resolve(__dirname, './dist')

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'test'

if (!process.env.CHROME_BIN) {
  process.env.CHROME_BIN = require('puppeteer').executablePath()
}

const testFiles = ['./test/browser/tests.js',]
if (process.env.NO_VTK !== '1') {
  testFiles.push('./test/browser/testsVTK.js')
}

const testConfig = path.resolve(__dirname, 'test', 'browser', 'config', 'itkConfigBrowserTest.js')

// https://github.com/ryanclark/karma-webpack/issues/498]
const output = {
  path: path.join(os.tmpdir(), '_karma_webpack_') + Math.floor(Math.random() * 1000000)
}

module.exports = function init (config) {
  config.set({
    plugins: [
      require('karma-webpack'),
      require('karma-tap'),
      require('karma-chrome-launcher'),
      require('karma-tap-pretty-reporter')
    ],

    basePath: '',
    frameworks: ['tap', 'webpack'],
    files: [
      { pattern: './dist/image-io/**', watched: true, served: true, included: false },
      { pattern: './dist/mesh-io/**', watched: true, served: true, included: false },
      { pattern: './dist/web-workers/**', watched: true, served: true, included: false },
      { pattern: './dist/pipelines/**', watched: true, served: true, included: false },
      { pattern: './build-emscripten/ExternalData/test/**', watched: true, served: true, included: false },
      { pattern: `${output.path}/**/*`, watched: false, included: false, },
    ].concat(testFiles),

    preprocessors: {
      './test/browser/**/*.js': ['webpack']
    },

    webpack: {
      mode: 'development',
      module: {
        rules: [].concat()
      },
      output,
      resolve: {
        modules: [
          path.resolve(__dirname, 'node_modules'),
          sourcePath
        ],
        fallback: {
          assert: false,
          module: false,
          url: false,
          path: require.resolve('path-browserify'),
          fs: false,
        },
        alias: {
          '../itkConfig.js': testConfig,
          '../../itkConfig.js': testConfig,
          stream: 'stream-browserify',
        }
      },
      plugins: [
        new webpack.DefinePlugin({
          __BASE_PATH__: "'/base'",
        }),
        new webpack.ProvidePlugin({ process: ['process/browser'] }),
      ],
    },

    webpackMiddleware: {
      noInfo: true
    },

    reporters: [
      'tap-pretty'
    ],

    client: {
      useIframe: true
    },

    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    // browserNoActivityTimeout: 600000,
    // browserDisconnectTimeout: 600000,

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true
  })
}
