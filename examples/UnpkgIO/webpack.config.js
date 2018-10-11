const path = require('path');

const webpack = require('webpack');

const entry = path.join(__dirname, './src/index.js');
const outputPath = path.join(__dirname, './dist');

const packageJSON = require('./package.json');
const itkVersion = packageJSON.dependencies.itk.substring(1);
const cdnPath = 'https://unpkg.com/itk@' + itkVersion;

module.exports = {
  node: {
    fs: 'empty',
  },
  entry,
  output: {
    path: outputPath,
    filename: 'index.js',
    publicPath: cdnPath,
  },
  module: {
    rules: [
      { test: entry, loader: 'expose-loader?index' },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env'] },
        },
      },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules')],
    alias: {
      './itkConfig$': path.resolve(__dirname, 'src', 'itkConfigCDN.js'),
    },
  },
  performance: {
    maxAssetSize: 10000000,
  },
};
