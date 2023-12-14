import fs from 'fs-extra'
import path from 'path'

function emscriptenPackageReadme(packageName, packageDescription, packageDir) {
  let readme = ''
  readme += `# ${packageName}\n`
  readme += `\n[![PyPI version](https://badge.fury.io/py/${packageName}.svg)](https://badge.fury.io/py/${packageName})\n`
  readme += `\n${packageDescription}\n`

  const dispatchPackage = packageName.replace(/-emscripten$/, '')
  readme += `\nThis package provides the Emscripten WebAssembly implementation. It is usually not called directly. Please use the [\`${dispatchPackage}\`](https://pypi.org/project/${dispatchPackage}/) instead.\n\n`
  readme += `\n## Installation\n
\`\`\`sh
import micropip
await micropip.install('${packageName}')
\`\`\`

## Development

\`\`\`sh
pip install hatch
hatch run download-pyodide
hatch run test
\`\`\`
`
  const readmePath = path.join(packageDir, 'README.md')
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, readme)
  }
}

export default emscriptenPackageReadme
