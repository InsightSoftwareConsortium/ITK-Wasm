import fs from 'fs-extra'
import path from 'path'

import { markdownTable } from 'markdown-table'
import wasmBinaryInterfaceJson from '../wasm-binary-interface-json.js'
import interfaceJsonTypeToInterfaceType from '../interface-json-type-to-interface-type.js'
import camelCase from '../camel-case.js'

import interfaceJsonTypeToTypeScriptType from './interface-json-type-to-typescript-type.js'
import packageToBundleName from './package-to-bundle-name.js'
import writeIfOverrideNotPresent from './write-if-override-not-present.js'

import interfaceFunctionsDemoHtml from './demo/interface-functions-demo-html.js'
import interfaceFunctionsDemoTypeScript from './demo/interface-functions-demo-typescript.js'

import typescriptBindings from './typescript-bindings.js'

// Array of types that will require an import from itk-wasm
const typesRequireImport = ['Image', 'Mesh', 'PolyData', 'TextFile', 'BinaryFile', 'TextFile', 'BinaryFile']

function bindgenResource(filePath) {
  return path.join(path.dirname(import.meta.url.substring(7)), 'resources', filePath)
}

function readFileIfNotInterfaceType(forNode, interfaceType, varName, indent) {
  if (forNode) {
    return `${indent}mountDirs.add(path.dirname(${varName} as string))\n`
  } else {
    if (interfaceType === 'TextFile') {

      return `${indent}let ${varName}File = ${varName}\n${indent}if (${varName} instanceof File) {\n${indent}  const ${varName}Buffer = await ${varName}.arrayBuffer()\n${indent}  ${varName}File = { path: ${varName}.name, data: new TextDecoder().decode(${varName}Buffer) }\n${indent}}\n`
    } else {
      return `${indent}let ${varName}File = ${varName}\n${indent}if (${varName} instanceof File) {\n${indent}  const ${varName}Buffer = await ${varName}.arrayBuffer()\n${indent}  ${varName}File = { path: ${varName}.name, data: new Uint8Array(${varName}Buffer) }\n${indent}}\n`
    }
  }
}

function bindgen (outputDir, buildDir, filteredWasmBinaries, options) {
  let readme = ''
  const packageName = options.packageName
  readme += `# ${packageName}\n`
  readme += `\n[![npm version](https://badge.fury.io/js/${packageName.replace('/', '%2F')}.svg)](https://www.npmjs.com/package/${packageName})\n`
  readme += `\n> ${options.packageDescription}\n`
  readme += `\n## Installation\n
\`\`\`sh
npm install ${packageName}
\`\`\`
`

  let readmeUsage = '\n## Usage\n'
  let readmeBrowserInterface = '\n### Browser interface\n\nImport:\n\n```js\nimport {\n'
  let readmeNodeInterface = '\n### Node interface\n\nImport:\n\n```js\nimport {\n'

  // libiconv does not generate
  const validEmscriptenWasmBinaries = filteredWasmBinaries.filter((wasmBinary) => {
    const prefix = wasmBinary.substring(0, wasmBinary.length-5)
    if (fs.existsSync(`${prefix}.js`)) {
      return true
    }
    return false
  })

  readmeBrowserInterface += typescriptBindings(outputDir, buildDir, validEmscriptenWasmBinaries, options, false)
  readmeBrowserInterface += `
#### setPipelinesBaseUrl

*Set base URL for WebAssembly assets when vendored.*

\`\`\`ts
function setPipelinesBaseUrl(
  baseUrl: string | URL
) : void
\`\`\`

#### getPipelinesBaseUrl

*Get base URL for WebAssembly assets when vendored.*

\`\`\`ts
function getPipelinesBaseUrl() : string | URL
\`\`\`

#### setPipelineWorkerUrl

*Set base URL for the itk-wasm pipeline worker script when vendored.*

\`\`\`ts
function setPipelineWorkerUrl(
  baseUrl: string | URL
) : void
\`\`\`

#### getPipelineWorkerUrl

*Get base URL for the itk-wasm pipeline worker script when vendored.*

\`\`\`ts
function getPipelineWorkerUrl() : string | URL
\`\`\`
`
  readmeNodeInterface += typescriptBindings(outputDir, buildDir, validEmscriptenWasmBinaries, options, true)
  readme += readmeUsage
  readme += readmeBrowserInterface
  readme += readmeNodeInterface

  const readmePath = path.join(outputDir, 'README.md')
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, readme)
  }
}

export default bindgen
