import fs from 'fs-extra'
import path from 'path'

function dispatchPackageReadme(packageName, packageDescription, packageDir) {
  let readme = ''
  readme += `# ${packageName}\n`
  readme += `\n[![PyPI version](https://badge.fury.io/py/${packageName}.svg)](https://badge.fury.io/py/${packageName})\n`
  readme += `\n${packageDescription}\n`
  readme += `\n## Installation\n
\`\`\`sh
pip install ${packageName}
\`\`\`
`
  const readmePath = path.join(packageDir, 'README.md')
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, readme)
  }
}

export default dispatchPackageReadme
