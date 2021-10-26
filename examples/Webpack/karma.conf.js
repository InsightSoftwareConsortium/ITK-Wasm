const os = require('os')
const path = require('path')
const webpack = require('webpack')

const sourcePath = path.resolve(__dirname, './dist')

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'test'


// https://github.com/ryanclark/karma-webpack/issues/498
const output = {
  path: path.join(os.tmpdir(), '_karma_webpack_') + Math.floor(Math.random() * 1000000),
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
      './test/index.js',
      { pattern: './dist/itk/image-io/**', watched: true, served: true, included: false },
      { pattern: './dist/itk/mesh-io/**', watched: true, served: true, included: false },
      { pattern: './dist/itk/polydata-io/**', watched: true, served: true, included: false },
      { pattern: './dist/itk/web-workers/**', watched: true, served: true, included: false }
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
          '../itkConfig.js': path.resolve(__dirname, 'test', 'config', 'itkConfigTest.js'),
          '../../itkConfig.js': path.resolve(__dirname, 'test', 'config', 'itkConfigTest.js'),
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

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true
  })
}
