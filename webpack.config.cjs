const path = require('path')

const webpack = require('webpack')

const entry = path.join(__dirname, 'dist', 'browser', 'index.js')
const outputPath = path.join(__dirname, 'dist', 'umd')

const packageJSON = require('./package.json')
const itkVersion = packageJSON.version
const cdnPath = `https://unpkg.com/itk-wasm@${itkVersion}/dist/`

module.exports = {
  name: 'Unpkg',
  stats: 'errors-only',
  entry,
  output: {
    path: outputPath,
    filename: 'itk.js',
    publicPath: cdnPath,
    library: {
      type: "umd",
      name: "itk",
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env'] }
        }
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules')],
    fallback: { fs: false, path: false, url: false, module: false },
    alias: {
      '../itkConfig.js': path.resolve(__dirname, 'src', 'itkConfigCDN.js'),
    }
  },
  performance: {
    maxAssetSize: 10000000
  }
}
