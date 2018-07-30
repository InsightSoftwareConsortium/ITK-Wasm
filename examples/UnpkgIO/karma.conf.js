var path = require('path')
var webpack = require('webpack')

var sourcePath = path.resolve(__dirname, './dist')

var packageJSON = require('./package.json')
var itkVersion = packageJSON.dependencies.itk.substring(1)
var cdnPath = '"https://unpkg.com/itk@' + itkVersion + '"'

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'test'

module.exports = function init (config) {
  config.set({
    plugins: [
      require('karma-webpack'),
      require('karma-tap'),
      require('karma-chrome-launcher'),
      require('karma-tap-pretty-reporter')
    ],

    basePath: '',
    frameworks: ['tap'],
    files: [
      './test/index.js'
    ],

    preprocessors: {
      './test/*.js': ['webpack']
    },

    webpack: {
      mode: 'development',
      node: {
        fs: 'empty'
      },
      module: {
        rules: [].concat()
      },
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

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true
  })
}
