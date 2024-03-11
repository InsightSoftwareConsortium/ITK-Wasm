import fs from 'fs-extra'
import path from 'path'

import typescriptBindings from './typescript-bindings.js'
import validEmscriptenWasmBinaries from '../valid-emscripten-wasm-binaries.js'

function bindgen(outputDir, buildDir, filteredWasmBinaries, options) {
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
  let readmeBrowserInterface =
    '\n### Browser interface\n\nImport:\n\n```js\nimport {\n'
  let readmeNodeInterface =
    '\n### Node interface\n\nImport:\n\n```js\nimport {\n'

  const emscriptenWasmBinaries =
    validEmscriptenWasmBinaries(filteredWasmBinaries)

  readmeBrowserInterface += typescriptBindings(
    outputDir,
    buildDir,
    emscriptenWasmBinaries,
    options,
    false
  )
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

`
  readmeNodeInterface += typescriptBindings(
    outputDir,
    buildDir,
    emscriptenWasmBinaries,
    options,
    true
  )
  readme += readmeUsage
  readme += readmeBrowserInterface
  readme += readmeNodeInterface

  const readmePath = path.join(outputDir, 'README.md')
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, readme)
  }
}

export default bindgen
