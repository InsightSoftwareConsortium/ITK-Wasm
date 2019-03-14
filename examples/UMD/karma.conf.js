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
      'https://unpkg.com/itk@9.4.0/umd/itk.js',
      './dist/index.js',
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
      },
    },

    webpackMiddleware: {
      noInfo: true
    },


    reporters: [
      'tap-pretty',
    ],

    client: {
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
