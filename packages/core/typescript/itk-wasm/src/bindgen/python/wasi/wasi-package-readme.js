import fs from 'fs-extra'
import path from 'path'

function wasiPackageReadme(packageName, packageDescription, packageDir) {
  let readme = ''
  readme += `# ${packageName}\n`
  readme += `\n[![PyPI version](https://badge.fury.io/py/${packageName}.svg)](https://badge.fury.io/py/${packageName})\n`
  readme += `\n${packageDescription}\n`

  const dispatchPackage = packageName.replace(/-wasi$/, '')
  readme += `\nThis package provides the WASI WebAssembly implementation. It is usually not called directly. Please use [\`${dispatchPackage}\`](https://pypi.org/project/${dispatchPackage}/) instead.\n\n`
  readme += `\n## Installation\n
\`\`\`sh
pip install ${packageName}
\`\`\`

## Development

\`\`\`sh
pip install pytest
pip install -e .
pytest

# or
pip install hatch
hatch run test
\`\`\`
`
  const readmePath = path.join(packageDir, 'README.md')
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, readme)
  }
}

export default wasiPackageReadme