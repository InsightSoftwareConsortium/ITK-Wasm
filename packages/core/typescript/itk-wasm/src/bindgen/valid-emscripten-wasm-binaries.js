import fs from 'fs-extra'

// libiconv does not generate
function validEmscriptenWasmBinaries(filteredWasmBinaries) {
  return filteredWasmBinaries.filter((wasmBinary) => {
    const prefix = wasmBinary.substring(0, wasmBinary.length - 5)
    if (fs.existsSync(`${prefix}.js`)) {
      return true
    }
    return false
  })
}

export default validEmscriptenWasmBinaries
