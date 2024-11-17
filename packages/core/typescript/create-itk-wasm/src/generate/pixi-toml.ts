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

[environments]
native = ["native"]
python = ["python"]

[dependencies]
python = "3.12.*"
pnpm = ">=9.12.1,<10"
hatch = ">=1.13.0,<2"
pip = ">=24.2,<25"

[target.win-64.dependencies]
m2w64-jq = ">=1.6.0,<2"

[target.unix.dependencies]
jq = ">=1.7.1,<2"

[activation]
scripts = ["itk_wasm_env.bash"]

[tasks.build]
depends-on = ["build-native", "build-typescript", "build-python"]
description = "Build the project"

[tasks.test]
cmd = "pnpm run test"
depends-on = ["download-test-data", "test-native", "test-python"]
description = "Run tests"

[tasks.publish]
depends-on = ["publish-typescript", "publish-python-wasi", "publish-python-emscripten", "publish-python-dispatch"]
description = "Synchronize package versions"

[tasks.version-sync]
depends-on = ["version-sync-typescript", "version-sync-python-wasi", "version-sync-python-emscripten", "version-sync-python-dispatch"]
description = "Synchronize package versions"

[tasks.pack-test-data]
cmd = "npx dam pack test/data test/data.tar.gz"
depends-on = ["install-typescript"]
outputs = ["test/data.tar.gz"]
description = "Pack the data into a tarball for upload and print CID for package.json"

[tasks.download-test-data]
cmd = "npx dam download test/data test/data.tar.gz $ITK_WASM_TEST_DATA_HASH $ITK_WASM_TEST_DATA_URLS"
depends-on = ["install-typescript"]
outputs = ["test/data.tar.gz"]
description = "Download test data"

[tasks.install-typescript]
cmd = "pnpm install"
description = "Install typescript dependencies"

[tasks.build-typescript]
cmd = "pnpm run build:gen:typescript"
depends-on = ["install-typescript"]
description = "Build typescript components"

[tasks.test-typescript]
cmd = "pnpm test"
depends-on = ["download-test-data"]
cwd = "typescript"
description = "Test typescript components"

[tasks.version-sync-typescript]
cmd = '''version=$(cat package.json | jq .version) &&
  jq ".version = $version" typescript/package.json > typescript/package.json.tmp &&
  mv typescript/package.json.tmp typescript/package.json'''

[tasks.publish-typescript]
cmd = "pnpm publish --filter \\"{typescript}\\""

[feature.python.dependencies]
pytest = ">=8.3.3,<9"

[feature.python.pypi-dependencies]
pyodide-py = ">=0.26.3, <0.27"
pytest-pyodide = ">=0.58.3, <0.59"
itkwasm = ">=1.0b180, <2"

[tasks.build-python]
cmd = "pnpm run build:gen:python"
depends-on = ["install-typescript"]
description = "Build python components"

[feature.python.tasks.download-pyodide]
cmd = '''curl -L https://github.com/pyodide/pyodide/releases/download/0.26.3/pyodide-0.26.3.tar.bz2 -o pyodide.tar.bz2 &&
  tar xjf pyodide.tar.bz2 &&
  rm pyodide.tar.bz2'''
outputs = ["pyodide"]
description = "Download Pyodide"

[feature.python.tasks.test-wasi]
cmd = "pytest"
cwd = "python/${project.pythonPackageName}-wasi"
description = "Run tests for ${project.pythonPackageName}-wasi"

[feature.python.tasks.serve-emscripten]
cmd = '''mkdir -p dist/pyodide &&
  cp -r ../../pyodide dist/ &&
  hatch build -t wheel ./dist/pyodide/ &&
  echo \\"\\nVisit http://localhost:8877/console.html\\n\\" &&
  python -m http.server --directory=./dist/pyodide 8877'''
cwd = "python/${project.pythonPackageName}-emscripten"
depends-on = ["download-pyodide"]
description = "Serve ${project.pythonPackageName}-emscripten for development"

[feature.python.tasks.test-emscripten]
cmd = '''mkdir -p dist/pyodide &&
  cp -r ../../pyodide dist/ &&
  hatch build -t wheel ./dist/pyodide/ &&
  pytest --dist-dir=./dist/pyodide --rt=chrome'''
cwd = "python/${project.pythonPackageName}-emscripten"
depends-on = ["download-pyodide"]
description = "Run tests for ${project.pythonPackageName}-emscripten"

[feature.python.tasks.serve-dispatch]
cmd = '''mkdir -p dist/pyodide &&
  cp -r ../../pyodide dist/ &&
  hatch build -t wheel ./dist/pyodide/ &&
  echo \\"\\nVisit http://localhost:8877/console.html\\n\\" &&
  python -m http.server --directory=./dist/pyodide 8877'''
cwd = "python/${project.pythonPackageName}"
depends-on = ["download-pyodide"]
description = "Serve ${project.pythonPackageName} for development"

[feature.python.tasks.test-dispatch]
cmd = '''mkdir -p dist/pyodide &&
  cp -r ../../pyodide dist/ &&
  hatch build -t wheel ./dist/pyodide/ &&
  cd ../${project.pythonPackageName}-emscripten &&
  hatch build -t wheel ./dist/pyodide/ &&
  cd ../${project.pythonPackageName} &&
  cp ../${project.pythonPackageName}-emscripten/dist/pyodide/*_emscripten*.whl ./dist/pyodide/ &&
  pytest --dist-dir=./dist/pyodide --rt=chrome'''
cwd = "python/${project.pythonPackageName}"
depends-on = ["download-pyodide"]
description = "Run python tests for ${project.pythonPackageName}"

[feature.python.tasks.test-python]
depends-on = ["test-wasi", "test-emscripten", "test-dispatch"]
description = "Run tests for all Python packages"

[tasks.version-sync-python-wasi]
cmd = '''version=$(cat ../../package.json | jq -r .version) &&
  echo "version is $version" &&
  hatch version $version'''
cwd = "python/${project.pythonPackageName}-wasi"

[tasks.version-sync-python-emscripten]
cmd = '''version=$(cat ../../package.json | jq -r .version) &&
  hatch version $version'''
cwd = "python/${project.pythonPackageName}-emscripten"

[tasks.version-sync-python-dispatch]
cmd = '''version=$(cat ../../package.json | jq -r .version) &&
  hatch version $version'''
cwd = "python/${project.pythonPackageName}"

[tasks.publish-python-user-check]
cmd = "if [ -n \\"$HATCH_INDEX_USER\\"]; then echo \\"HATCH_INDEX_USER is set\\"; else echo \\"HATCH_INDEX_USER is not set\\"; exit 1; fi"

[tasks.publish-python-wasi]
cmd = '''hatch build &&
  hatch publish'''
cwd = "python/${project.pythonPackageName}-wasi"

[tasks.publish-python-emscripten]
cmd = '''hatch build &&
  hatch publish'''
cwd = "python/${project.pythonPackageName}-emscripten"

[tasks.publish-python-dispatch]
cmd = '''hatch build &&
  hatch publish'''
cwd = "python/${project.pythonPackageName}"
[feature.native.tasks.clone-itk]
cmd = ["stat", "$ITK_WASM_ITK_SOURCE_DIR", ">/dev/null", "||",
  "git", "clone",
    "--depth=10",
    "--branch=$ITK_WASM_ITK_BRANCH",
    "$ITK_WASM_ITK_REPOSITORY",
    "$ITK_WASM_ITK_SOURCE_DIR"]
# Note: pixi does not seem to reliably support activation environmental variables in task inputs / outputs
outputs = ["native/ITK/LICENSE"]
description = "Fetch ITK's source code"

[feature.native.tasks.configure-itk]
cmd = '''cmake -B$ITK_WASM_ITK_BUILD_DIR -S$ITK_WASM_ITK_SOURCE_DIR -GNinja
  -DCMAKE_CXX_STANDARD:STRING=20
  -DCMAKE_BUILD_TYPE:STRING=Debug
  -DBUILD_EXAMPLES:BOOL=OFF
  -DBUILD_TESTING:BOOL=OFF
  -DBUILD_SHARED_LIBS:BOOL=OFF
  -DBUILD_STATIC_LIBS:BOOL=ON
  -DITK_LEGACY_REMOVE:BOOL=ON
  -DITK_BUILD_DEFAULT_MODULES:BOOL=ON
  -DITKGroup_IO:BOOL=ON
  -DH5_HAVE_GETPWUID:BOOL=OFF
  -DModule_MeshToPolyData:BOOL=ON
  -DDO_NOT_BUILD_ITK_TEST_DRIVER:BOOL=ON
  -DOPJ_USE_THREAD:BOOL=OFF
  -DNO_FLOAT_EXCEPTIONS:BOOL=ON
  -DITK_MSVC_STATIC_RUNTIME_LIBRARY=ON'''
depends-on = ["clone-itk"]
# Note: pixi does not seem to reliably support activation environmental variables in task inputs / outputs
# outputs = ["$ITK_WASM_ITK_BUILD_DIR/CMakeFiles/"]
outputs = ["native/ITK-build/CMakeFiles/**"]
description = "Configure ITK"

[feature.native.tasks.build-itk]
cmd = "cmake --build $ITK_WASM_ITK_BUILD_DIR"
depends-on = ["configure-itk"]
outputs = ["native/ITK-build/**"]
description = "Build ITK"

[feature.native.tasks.clone-itk-wasm]
cmd = ["stat", "$ITK_WASM_WEBASSEMBLY_INTERFACE_SOURCE_DIR", ">/dev/null", "||",
  "git", "clone",
    "--depth=10",
    "--branch=$ITK_WASM_WEBASSEMBLY_INTERFACE_BRANCH",
    "$ITK_WASM_WEBASSEMBLY_INTERFACE_REPOSITORY",
    "$ITK_WASM_WEBASSEMBLY_INTERFACE_SOURCE_DIR"]
# Note: pixi does not seem to reliably support activation environmental variables in task inputs / outputs
outputs = ["native/ITK-Wasm/LICENSE"]
description = "Fetch ITK's source code"

[feature.native.tasks.configure-itk-wasm]
cmd = '''cmake -B$ITK_WASM_NATIVE_WORKSPACE/ITK-Wasm-build
  -S$ITK_WASM_NATIVE_WORKSPACE/ITK-Wasm
  -GNinja
  -DITK_DIR:PATH=$ITK_WASM_ITK_BUILD_DIR
  -DBUILD_TESTING:BOOL=OFF
  -DCMAKE_CXX_STANDARD:STRING=20
  -DCMAKE_BUILD_TYPE:STRING=Debug'''
depends-on = ["build-itk", "clone-itk-wasm"]
outputs = ["native/ITK-Wasm-build/CMakeFiles/"]
description = "Configure ITK-Wasm"

[feature.native.tasks.build-itk-wasm]
cmd = "cmake --build $ITK_WASM_NATIVE_WORKSPACE/ITK-Wasm-build"
depends-on = ["configure-itk-wasm"]
description = "Build ITK-Wasm"

[feature.native.tasks.configure-native]
cmd = '''cmake -B$ITK_WASM_NATIVE_WORKSPACE/${project.name}-build -S. -GNinja
  -DITK_DIR:PATH=$ITK_WASM_ITK_BUILD_DIR
  -DBUILD_TESTING:BOOL=ON
  -DCMAKE_CXX_STANDARD:STRING=20
  -DCMAKE_BUILD_TYPE:STRING=Debug'''
depends-on = ["build-itk-wasm"]
description = "Configure native build"

[feature.native.tasks.build-native]
cmd = "cmake --build $ITK_WASM_NATIVE_WORKSPACE/${project.name}-build"
depends-on = ["configure-native"]
description = "Build native binaries"

[feature.native.tasks.test-native]
cmd = "ctest --test-dir $ITK_WASM_NATIVE_WORKSPACE/${project.name}-build"
depends-on = ["build-native"]
description = "Test native binaries"

`
  fs.writeFileSync(pixiTomlPath, content)
}

export default generatePixiToml
