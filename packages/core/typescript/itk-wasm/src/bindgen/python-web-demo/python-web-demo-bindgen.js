import fs from 'fs-extra'
import path from 'path'

import webDemo from './web-demo.js'
import validEmscriptenWasmBinaries from '../valid-emscripten-wasm-binaries.js'

function bindgen (outputDir, buildDir, filteredWasmBinaries, options) {
  let readme = ''
  const packageName = options.packageName
  readme += `# ${packageName}\n`
  readme += `\n[![PyPI version](https://badge.fury.io/py/${packageName}.svg)](https://badge.fury.io/py/${packageName})\n`
  readme += `\n> API Demo: ${options.packageDescription}\n`
  readme += `\nThis is a simple web browser app built with Python, HTML, and CSS that demonstrates the [${packageName}](https://badge.fury.io/py/${packageName}) Python package.\n`
  readme += `\n## Development

The app uses the Python package published on pypi.org and the corresponding JavaScript package published npmjs.com.

The web app can be developed locally with any http server that serves static files. For example:

\`\`\`sh
python -m http.server
\`\`\`
`

  const emscriptenWasmBinaries = validEmscriptenWasmBinaries(filteredWasmBinaries)
  webDemo(outputDir, buildDir, emscriptenWasmBinaries, options)

  const readmePath = path.join(outputDir, 'README.md')
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, readme)
  }
}

export default bindgen
