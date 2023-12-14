import fs from 'fs-extra'
import path from 'path'

function packageVersion(packageDir, pypackage, options) {
  const versionString = options.packageVersion ?? '0.1.0'
  const version = `__version__ = "${versionString}"
`
  const versionPath = path.join(packageDir, pypackage, '_version.py')
  if (!fs.existsSync(versionPath) || typeof options.packageVersion !== 'undefined') {
    fs.writeFileSync(versionPath, version)
  }
}

export default packageVersion
