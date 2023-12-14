import dispatchPackage from "./dispatch-package.js"
import wasiPackage from "./wasi/wasi-package.js"
import emscriptenPackage from "./emscripten/emscripten-package.js"

function bindgen (outputDir, buildDir, filteredWasmBinaries, options) {
  dispatchPackage(outputDir, buildDir, filteredWasmBinaries, options)
  wasiPackage(outputDir, buildDir, filteredWasmBinaries, options)
  emscriptenPackage(outputDir, buildDir, filteredWasmBinaries, options)
}

export default bindgen
