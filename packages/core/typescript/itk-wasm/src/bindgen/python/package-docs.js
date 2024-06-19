import fs from 'fs-extra'
import path from 'path'

import mkdirP from '../mkdir-p.js'
import bindgenResource from './bindgen-resource.js'

function packageDocs(packageName, packageDir, pypackage, options) {
  const docFiles = [
    'requirements.txt',
    'Makefile',
    'make.bat',
    path.join('_static', 'logo.svg'),
    path.join('_static', 'favicon.png'),
  ]

  const docsDir = path.join(packageDir, 'docs')
  mkdirP(docsDir)
  mkdirP(path.join(docsDir, '_static'))
  docFiles.forEach((filePath) => {
    const outputPath = path.join(docsDir, filePath)
    if (!fs.existsSync(outputPath)) {
      const contents = fs.readFileSync(bindgenResource(path.join('docs', filePath)), {encoding:'utf8', flag:'r'})
      fs.writeFileSync(outputPath, contents)
    }
  })

  const confPyPath = path.join(docsDir, 'conf.py')
  if (!fs.existsSync(confPyPath)) {
    let confPyContent = fs.readFileSync(bindgenResource(path.join('docs', 'conf.py')), {encoding:'utf8', flag:'r'})
    confPyContent = confPyContent.replaceAll('@bindgenProject@', packageName)
    confPyContent = confPyContent.replaceAll('@bindgenPyPackage@', pypackage)
    const repository = options.repository ?? 'https://github.com/InsightSoftwareConsortium/ITK-Wasm'
    confPyContent = confPyContent.replaceAll('@bindgenRepository@', repository)
    fs.writeFileSync(confPyPath, confPyContent)
  }

  const indexPath = path.join(docsDir, 'index.md')
  if (!fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(bindgenResource(path.join('docs', 'index.md')), {encoding:'utf8', flag:'r'})
    indexContent = indexContent.replaceAll('@bindgenProject@', packageName)
    indexContent = indexContent.replaceAll('@bindgenPyPackage@', pypackage)
    indexContent = indexContent.replaceAll('@bindgenPackageDescription@', options.packageDescription)
    const repository = options.repository ?? 'https://github.com/InsightSoftwareConsortium/ITK-Wasm'
    indexContent = indexContent.replaceAll('@bindgenRepository@', repository)
    fs.writeFileSync(indexPath, indexContent)
  }
}

export default packageDocs