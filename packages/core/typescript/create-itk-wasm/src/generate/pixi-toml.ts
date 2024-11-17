import fs from 'fs'
import path from 'path'

import ProjectSpec from '../project-spec.js'

function generatePixiToml(project: ProjectSpec) {
  const pixiTomlPath = path.join(project.directory, 'pixi.toml')
  if (fs.existsSync(pixiTomlPath)) {
    return
  }

  const content = `[project]
authors = ["${project.author}"]
channels = ["conda-forge"]
description = "${project.packageDescription}"
name = "${project.name}"
platforms = ["win-64", "linux-64", "linux-aarch64", "osx-arm64"]
version = "0.1.0"

[dependencies]
python = "3.12.*"
pnpm = ">=9.12.1,<10"
hatch = ">=1.13.0,<2"
pip = ">=24.2,<25"

[tasks.build]
cmd = "pnpm run build"
description = "Build the project"

[tasks.test]
cmd = "pnpm run test"
description = "Run tests"

[tasks.pnpm-install]
cmd = "pnpm install"
description = "Install Node.js dependencies"

[tasks.test-data-download]
cmd = "npx dam download test/data test/data.tar.gz $ITK_WASM_TEST_DATA_HASH $ITK_WASM_TEST_DATA_URLS"
depends-on = ["pnpm-install"]
outputs = ["test/data.tar.gz"]
description = "Download test data"

[target.win-64.dependencies]
m2w64-jq = ">=1.6.0,<2"

[target.unix.dependencies]
jq = ">=1.7.1,<2"

[tasks.version-sync-typescript]
cmd = '''version=$(cat package.json | jq .version) &&
  jq ".version = $version" typescript/package.json > typescript/package.json.tmp &&
  mv typescript/package.json.tmp typescript/package.json'''

[tasks.version-sync-python-wasi]
cmd = '''version=$(cat ../../package.json | jq -r .version) &&
  echo "version is $version" &&
  hatch version $version'''
cwd = "python/itkwasm-${project.pythonPackageName}-wasi"

[tasks.version-sync-python-emscripten]
cmd = '''version=$(cat ../../package.json | jq -r .version) &&
  hatch version $version'''
cwd = "python/itkwasm-${project.pythonPackageName}-emscripten"

[tasks.version-sync-python-dispatch]
cmd = '''version=$(cat ../../package.json | jq -r .version) &&
  hatch version $version'''
cwd = "python/itkwasm-${project.pythonPackageName}"

[tasks.version-sync]
depends-on = ["version-sync-typescript", "version-sync-python-wasi", "version-sync-python-emscripten", "version-sync-python-dispatch"]
description = "Synchronize package versions"

[tasks.publish-typescript]
cmd = "pnpm publish --filter \\"{typescript}\\""

[tasks.publish-python-user-check]
cmd = "if [ -n \\"$HATCH_INDEX_USER\\"]; then echo \\"HATCH_INDEX_USER is set\\"; else echo \\"HATCH_INDEX_USER is not set\\"; exit 1; fi"

[tasks.publish-python-wasi]
cmd = '''hatch build &&
  hatch publish'''
cwd = "python/itkwasm-${project.pythonPackageName}-wasi"

[tasks.publish-python-emscripten]
cmd = '''hatch build &&
  hatch publish'''
cwd = "python/itkwasm-${project.pythonPackageName}-emscripten"

[tasks.publish-python-dispatch]
cmd = '''hatch build &&
  hatch publish'''
cwd = "python/itkwasm-${project.pythonPackageName}"

[tasks.publish]
depends-on = ["publish-typescript", "publish-python-wasi", "publish-python-emscripten", "publish-python-dispatch"]
description = "Synchronize package versions"

[feature.python.dependencies]
pytest = ">=8.3.3,<9"

[feature.python.pypi-dependencies]
pyodide-py = ">=0.26.3, <0.27"
pytest-pyodide = ">=0.58.3, <0.59"
itkwasm = ">=1.0b180, <2"

[feature.python.tasks.test-wasi]
cmd = "pytest"
cwd = "python/itkwasm-${project.pythonPackageName}-wasi"
description = "Run tests for itkwasm-${project.pythonPackageName}-wasi"

[feature.python.tasks.download-pyodide]
cmd = '''curl -L https://github.com/pyodide/pyodide/releases/download/0.26.3/pyodide-0.26.3.tar.bz2 -o pyodide.tar.bz2 &&
  tar xjf pyodide.tar.bz2 &&
  rm pyodide.tar.bz2'''
outputs = ["pyodide"]
description = "Download Pyodide"

[feature.python.tasks.test-emscripten]
cmd = '''mkdir -p dist/pyodide &&
  cp -r ../../pyodide dist/ &&
  hatch build -t wheel ./dist/pyodide/ &&
  pytest --dist-dir=./dist/pyodide --rt=chrome'''
cwd = "python/itkwasm-${project.pythonPackageName}-emscripten"
depends-on = ["download-pyodide"]
description = "Run tests for itkwasm-${project.pythonPackageName}-emscripten"

[feature.python.tasks.serve-emscripten]
cmd = '''mkdir -p dist/pyodide &&
  cp -r ../../pyodide dist/ &&
  hatch build -t wheel ./dist/pyodide/ &&
  echo \\"\\nVisit http://localhost:8877/console.html\\n\\" &&
  python -m http.server --directory=./dist/pyodide 8877'''
cwd = "python/itkwasm-${project.pythonPackageName}-emscripten"
depends-on = ["download-pyodide"]
description = "Serve itkwasm-${project.pythonPackageName}-emscripten for development"

[feature.python.tasks.test-dispatch]
cmd = '''mkdir -p dist/pyodide &&
  cp -r ../../pyodide dist/ &&
  hatch build -t wheel ./dist/pyodide/ &&
  cp ../itkwasm-${project.pythonPackageName}-emscripten/dist/pyodide/itkwasm_*_emscripten*.whl ./dist/pyodide/ &&
  pytest --dist-dir=./dist/pyodide --rt=chrome'''
cwd = "python/itkwasm-${project.pythonPackageName}"
depends-on = ["download-pyodide"]
description = "Run tests for itkwasm-${project.pythonPackageName}"

[feature.python.tasks.serve-dispatch]
cmd = '''mkdir -p dist/pyodide &&
  cp -r ../../pyodide dist/ &&
  hatch build -t wheel ./dist/pyodide/ &&
  echo \\"\\nVisit http://localhost:8877/console.html\\n\\" &&
  python -m http.server --directory=./dist/pyodide 8877'''
cwd = "python/itkwasm-${project.pythonPackageName}"
depends-on = ["download-pyodide"]
description = "Serve itkwasm-${project.pythonPackageName} for development"

[feature.python.tasks.test-python]
depends-on = ["test-wasi", "test-emscripten", "test-dispatch"]
description = "Run tests for all Python packages"

[environments]
python = ["python"]
`
  fs.writeFileSync(pixiTomlPath, content)
}

export default generatePixiToml
