const path = require('path')

const webpack = require('webpack')

const sourcePath = path.resolve(__dirname, './dist')

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
    frameworks: ['tap', 'webpack'],
    files: [
      'https://cdn.jsdelivr.net/npm/itk-wasm@1.0.0-a.7/dist/umd/itk-wasm.min.js',
      'https://unpkg.com/itk-vtk-viewer@9.23.2/dist/itkVtkViewerCDN.js',
      './dist/index.js',
      './test/index.js'
    ],

    preprocessors: {
      './test/*.js': ['webpack']
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
        alias: {
          stream: 'stream-browserify',
        },
        fallback: {
          assert: false,
          module: false,
          url: false,
          buffer: false,
          path: require.resolve('path-browserify'),
          fs: false,
        },
      },
      plugins: [
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
