const path = require('path')

const webpack = require('webpack')

const ResolveTypeScriptPlugin = require("resolve-typescript-plugin")
const { config } = require('process')
const WebPackBar = require('webpackbar')

const entry = path.join(__dirname, 'src', 'browser', 'index.ts')
const outputPath = path.join(__dirname, 'dist', 'umd')

const configDevelopment = path.resolve(__dirname, 'dist', 'itkConfigDevelopment.js')
const configProduction = path.resolve(__dirname, 'dist', 'itkConfig.js')
const configDevServer = path.resolve(__dirname, 'src', 'itkConfigDevServer.js')

const library = {
  type: 'umd',
  name: 'itk'
}
const moduleConfig = {
  rules: [
    {
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: { presets: ['@babel/preset-env'] }
      }
    },
    {
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    },
  ]
}
const fallback = { fs: false, path: false, url: false, module: false }
const modules = [path.resolve(__dirname, 'node_modules')]
const performance = {
  maxAssetSize: 10000000
}

const stats = 'errors-only'

const devServer = {
  port: 8083,
  devMiddleware: {
    writeToDisk: true,
  },
  static: [
    {
      publicPath: '/test-data',
      directory: path.join(__dirname, 'build-emscripten', 'ExternalData', 'test', 'Input'),
      staticOptions: {
        dotfiles: 'allow',
      },
    },
    {
      publicPath: '/web-workers',
      directory: path.join(__dirname, 'dist', 'web-workers'),
    },
    {
      publicPath: '/image-io',
      directory: path.join(__dirname, 'dist', 'image-io'),
    },
    {
      publicPath: '/mesh-io',
      directory: path.join(__dirname, 'dist', 'mesh-io'),
    },
    {
      publicPath: '/pipelines',
      directory: path.join(__dirname, 'dist', 'pipelines'),
    },
    {
      publicPath: '/',
      directory: path.join(__dirname, 'dist', 'umd'),
      staticOptions: {
        dotfiles: 'allow',
      },
    },
  ],
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
  },
}

module.exports = (env, argv) => [
  {
  name: 'development',
  mode: 'development',
  stats,
  entry,
  output: {
    path: outputPath,
    filename: argv.mode === 'development' ? 'itk-wasm.js' : 'itk-wasm.min.js',
    library
  },
  module: moduleConfig,
  resolve: {
    modules,
    fallback,
    alias: {
      '../itkConfig.js': argv.mode === 'development' ? env.DEVSERVER ? configDevServer : configDevelopment : configProduction,
      '../../itkConfig.js': argv.mode === 'development' ? env.DEVSERVER ? configDevServer : configDevelopment : configProduction,
    },
    plugins: [new ResolveTypeScriptPlugin()],
  },
  performance,
  plugins: [new WebPackBar(),],
  devtool: argv.mode === 'development' ? 'eval-cheap-module-source-map' : 'source-map',
  devServer,
},
]
