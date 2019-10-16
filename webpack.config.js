const path = require('path')

const webpack = require('webpack')

const entry = path.join(__dirname, 'src', 'index.js')
const outputPath = path.join(__dirname, 'dist', 'umd')

const packageJSON = require('./package.json')
const itkVersion = packageJSON.version
const cdnPath = 'https://unpkg.com/itk@' + itkVersion

module.exports = {
  name: packageJSON.name,
  node: {
    fs: 'empty'
  },
  entry,
  output: {
    path: outputPath,
    filename: 'itk.js',
    publicPath: cdnPath,
    libraryTarget: 'umd'
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
    alias: {
      './itkConfig$': path.resolve(__dirname, 'src', 'itkConfigCDN.js'),
      itk: __dirname
    }
  },
  performance: {
    maxAssetSize: 10000000
  }
}
