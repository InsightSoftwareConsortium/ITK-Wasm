import fs from 'fs-extra'
import path from 'path'

import bindgenResource from './bindgen-resource.js'

function packagePyProjectToml(packageName, packageDir, bindgenPyPackage, options) {
  let pyProjectToml = fs.readFileSync(bindgenResource('template.pyproject.toml'), {encoding:'utf8', flag:'r'})
  pyProjectToml = pyProjectToml.replaceAll('@bindgenPackageName@', packageName)
  const repository = options.repository ?? 'https://github.com/InsightSoftwareConsortium/ITK-Wasm'
  const bindgenPackageDescription = options.packageDescription
  let bindgenKeywords = ''
  let bindgenDependencies = ''
  let bindgenHatchEnvDependencies = ''
  let bindgenHatchEnvScripts = `
[tool.hatch.envs.default.scripts]
test = "pytest"
`
  if (packageName.endsWith('wasi')) {
    bindgenDependencies += '\n    "importlib_resources",\n'
    bindgenKeywords = '\n  "wasi",'
  } else if (packageName.endsWith('emscripten')) {
    bindgenKeywords = '\n  "emscripten",'
    bindgenHatchEnvDependencies = '\n  "pytest-pyodide",'
    bindgenHatchEnvScripts = `
[tool.hatch.envs.default.scripts]
test = [
  "hatch build -t wheel ./dist/pyodide/",
  "pytest --dist-dir=./dist/pyodide --rt=chrome",
]
download-pyodide = [
  "curl -L https://github.com/pyodide/pyodide/releases/download/0.25.1/pyodide-0.25.1.tar.bz2 -o pyodide.tar.bz2",
  "tar xjf pyodide.tar.bz2",
  "rm -rf dist/pyodide pyodide.tar.bz2",
  "mkdir -p dist",
  "mv pyodide dist",
]
serve = [
  "hatch build -t wheel ./dist/pyodide/",
  'echo "Visit http://localhost:8877/console.html"',
  "python -m http.server --directory=./dist/pyodide 8877",
]
`

  } else {
    bindgenKeywords = '\n  "wasi",\n  "emscripten",'
    bindgenDependencies += `\n    "${packageName}-wasi; sys_platform != \\"emscripten\\"",\n    "${packageName}-emscripten; sys_platform == \\"emscripten\\"",\n`
  }
  pyProjectToml = pyProjectToml.replaceAll('@bindgenKeywords@', bindgenKeywords)
  pyProjectToml = pyProjectToml.replaceAll('@bindgenDependencies@', bindgenDependencies)
  pyProjectToml = pyProjectToml.replaceAll('@bindgenHatchEnvDependencies@', bindgenHatchEnvDependencies)
  pyProjectToml = pyProjectToml.replaceAll('@bindgenHatchEnvScripts@', bindgenHatchEnvScripts)
  pyProjectToml = pyProjectToml.replaceAll('@bindgenProjectRepository@', repository)
  pyProjectToml = pyProjectToml.replaceAll('@bindgenPyPackage@', bindgenPyPackage)
  pyProjectToml = pyProjectToml.replaceAll('@bindgenPackageDescription@', bindgenPackageDescription)
  const pyProjectTomlPath = path.join(packageDir, 'pyproject.toml')
  if (!fs.existsSync(pyProjectTomlPath)) {
    fs.writeFileSync(pyProjectTomlPath, pyProjectToml)
  }
}

export default packagePyProjectToml
