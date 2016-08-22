var path = require("path");
module.exports = {
    entry: "./src/itk.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "itk.bundle.js",
        library: "itk",
        libraryTarget: "commonjs2"
    },
    target: "node",
    module: {
        loaders: [{
            test: path.join(__dirname, 'src'),
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
              presets: ['es2015']
            }},
            {
            test: /\.json$/,
            loader: 'json-loader'
            }
        ]
    }
};
