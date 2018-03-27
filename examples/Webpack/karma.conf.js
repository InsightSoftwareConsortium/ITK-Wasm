var path = require('path')
var webpack = require('webpack')

var sourcePath = path.resolve(__dirname, './dist')

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
      './test/index.js',
      { pattern: './dist/itk/ImageIOs/**', watched: true, served: true, included: false },
      { pattern: './dist/itk/MeshIOs/**', watched: true, served: true, included: false },
      { pattern: './dist/itk/WebWorkers/**', watched: true, served: true, included: false }
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
          __BASE_PATH__: "'/base'"
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
