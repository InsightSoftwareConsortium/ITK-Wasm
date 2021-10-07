/* eslint-disable global-require */
/* eslint-disable react/require-extension */
const path = require('path')
const webpack = require('webpack')
const sourcePath = path.resolve(__dirname, './dist')

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'test'

if (!process.env.CHROME_BIN) {
  process.env.CHROME_BIN = require('puppeteer').executablePath()
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
      './test/browser/tests.js',
      { pattern: './dist/image-io/**', watched: true, served: true, included: false },
      { pattern: './dist/mesh-io/**', watched: true, served: true, included: false },
      { pattern: './dist/polydata-io/**', watched: true, served: true, included: false },
      { pattern: './dist/web-workers/**', watched: true, served: true, included: false },
      { pattern: './dist/pipelines/**', watched: true, served: true, included: false },
      { pattern: './build/ExternalData/test/**', watched: true, served: true, included: false }
    ],

    preprocessors: {
      './test/browser/**/*.js': ['webpack']
    },

    webpack: {
      mode: 'development',
      module: {
        rules: [].concat()
      },
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
          './itkConfig$': path.resolve(__dirname, 'test', 'browser', 'config', 'itkConfigBrowserTest.js'),
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
