const path = require('path')

const webpack = require('webpack')

const entry = path.join(__dirname, 'dist', 'browser', 'index.js')
const outputPath = path.join(__dirname, 'dist', 'umd')

const packageJSON = require('./package.json')
const cdnPath = 'https://cdn.jsdelivr.net/npm/'
// const cdnPath = `https://unpkg.com/'
const cdnConfig = path.resolve(__dirname, 'src', 'itkConfigCDN.js')
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
    }
  ]
}
const resolve = {
  modules: [path.resolve(__dirname, 'node_modules')],
  fallback: { fs: false, path: false, url: false, module: false },
  alias: {
    '../itkConfig.js': cdnConfig,
    '../../itkConfig.js': cdnConfig
  }
}
const performance = {
  maxAssetSize: 10000000
}
const plugins = [
  new webpack.DefinePlugin({
    __itk_version__: JSON.stringify(packageJSON.version)
  })
]

const stats = 'errors-only'

module.exports = [{
  name: 'development',
  mode: 'development',
  stats,
  entry,
  output: {
    path: outputPath,
    filename: 'itk-wasm.js',
    publicPath: cdnPath,
    library
  },
  module: moduleConfig,
  resolve,
  plugins,
  performance
},
{
  name: 'production',
  mode: 'production',
  stats,
  entry,
  output: {
    path: outputPath,
    filename: 'itk-wasm.min.js',
    publicPath: cdnPath,
    library
  },
  module: moduleConfig,
  resolve,
  plugins,
  performance
}
]
