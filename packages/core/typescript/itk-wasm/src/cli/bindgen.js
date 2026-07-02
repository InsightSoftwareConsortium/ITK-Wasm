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

  // Honor an optional, opt-in exclude list so build-only helper executables (e.g. self-contained
  // test-input generators used by C++ CTests) are not emitted as public language bindings. The list is
  // configured as string pipeline names under "itk-wasm.bindgen-exclude" in the package's package.json,
  // where each name matches a binary's stem after stripping the toolchain and .wasm suffixes
  // (e.g. "foo-generate-inputs" matches both "foo-generate-inputs.wasm" and "foo-generate-inputs.wasi.wasm").
  let bindgenExclude = []
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    bindgenExclude = packageJson['itk-wasm']?.['bindgen-exclude'] ?? []
  } catch (err) {
    // No package.json or no config in the current directory: nothing to exclude.
  }
  if (bindgenExclude.length > 0) {
    filteredWasmBinaries = filteredWasmBinaries.filter((binary) => {
      const stem = path
        .basename(binary)
        .replace(/\.wasm$/, '')
        .replace(/\.(wasi|emscripten)$/, '')
      return !bindgenExclude.includes(stem)
    })
  }

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
