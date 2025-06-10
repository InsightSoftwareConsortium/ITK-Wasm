import path from "path";
import { fileURLToPath } from "url";

import CopyPlugin from "copy-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const entry = path.join(__dirname, "src", "index.js");
const outputPath = path.join(__dirname, "./dist");

export default {
  entry,
  output: {
    path: outputPath,
    filename: "index.js",
  },
  module: {
    rules: [{ test: /\.js$/, loader: "babel-loader" }],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "node_modules/@itk-wasm/image-io/dist/pipelines/*.{js,wasm,wasm.zst}",
          to: "pipelines/[name][ext]",
        },
      ],
    }),
  ],
  resolve: {
    fallback: { fs: false, path: false, url: false, module: false },
  },
  performance: {
    maxAssetSize: 10000000,
    maxEntrypointSize: 10000000,
  },
};
