import fs from 'fs-extra'
import path from 'path'

import glob from 'glob'

import processCommonOptions from './process-common-options.js'

import typescriptBindgen from '../bindgen/typescript/typescript-bindgen.js'
import pythonBindgen from '../bindgen/python/python-bindgen.js'
import pythonWebDemoBindgen from '../bindgen/python-web-demo/python-web-demo-bindgen.js'

import program from './program.js'

function bindgen(options) {
  options.packageDescription = options.packageDescription.join(' ')

  const { buildDir } = processCommonOptions(program)

  const iface = options.interface ?? 'typescript'
  const outputDir = options.outputDir ?? iface

  const buildDirPosix = buildDir.replaceAll('\\', '/')
  const wasmBinaries = glob.sync(`${buildDirPosix}/**/*.wasm`, {
    // CMake FetchContent
    // Symlinks can cause problems with glob on Windows.
    ignore: `${buildDirPosix}/_deps/**`
  })

  try {
    fs.mkdirSync(outputDir, { recursive: true })
  } catch (err) {
    if (err.code !== 'EE XIST') throw err
  }

  // Filter libraries.
  let filteredWasmBinaries = wasmBinaries.filter(
    (binary) => !path.basename(binary).startsWith('lib')
  )

  switch (iface) {
    case 'typescript':
      typescriptBindgen(outputDir, buildDir, filteredWasmBinaries, options)
      break
    case 'python':
      pythonBindgen(outputDir, buildDir, filteredWasmBinaries, options)
      break
    case 'python-web-demo':
      pythonWebDemoBindgen(outputDir, buildDir, filteredWasmBinaries, options)
      break
    default:
      console.error(`Unexpected interface: ${iface}`)
      process.exit(1)
  }

  process.exit(0)
}

export default bindgen
