import fs from 'fs'
import path from 'path'

import ProjectSpec from '../project-spec.js'

function generateItkWasmEnvBash(project: ProjectSpec) {
  const itkWasmEnvBashPath = path.join(project.directory, 'itk_wasm_env.bash')
  if (fs.existsSync(itkWasmEnvBashPath)) {
    return
  }

  const content = `#!/usr/bin/env bash

function die() {
    echo "$1"
    exit 1
}

export ITK_WASM_TEST_DATA_HASH=\${ITK_WASM_TEST_DATA_HASH:-$(cat package.json | jq -e -r '."itk-wasm"."test-data-hash"')}
export ITK_WASM_TEST_DATA_URLS=\${ITK_WASM_TEST_DATA_URLS:-$(cat package.json | jq -e -r '."itk-wasm"."test-data-urls" | join(" ")')}

export ITK_WASM_ITK_REPOSITORY=\${ITK_WASM_ITK_REPOSITORY:-"https://github.com/thewtex/ITK"}
export ITK_WASM_ITK_BRANCH=\${ITK_WASM_ITK_BRANCH:-"itkwasm-2024-05-20-5db055d7ad3b-4"}

export ITK_WASM_NATIVE_WORKSPACE=\${ITK_WASM_NATIVE_WORKSPACE:-$(pwd)/native}

export ITK_WASM_ITK_SOURCE_DIR=\${ITK_WASM_ITK_SOURCE_DIR:-\${ITK_WASM_NATIVE_WORKSPACE}/ITK}
export ITK_WASM_ITK_BUILD_DIR=\${ITK_WASM_ITK_BUILD_DIR:-\${ITK_WASM_NATIVE_WORKSPACE}/ITK-build}
mkdir -p \${ITK_WASM_ITK_BUILD_DIR} || die "Could not create ITK build directory"

export ITK_WASM_WEBASSEMBLY_INTERFACE_REPOSITORY=\${ITK_WASM_WEBASSEMBLY_INTERFACE_REPOSITORY:-"https://github.com/InsightSoftwareConsortium/ITK-Wasm"}
export ITK_WASM_WEBASSEMBLY_INTERFACE_BRANCH=\${ITK_WASM_WEBASSEMBLY_INTERFACE_BRANCH:-"main"}

export ITK_WASM_WEBASSEMBLY_INTERFACE_SOURCE_DIR=\${ITK_WASM_WEBASSEMBLY_INTERFACE_SOURCE_DIR:-\${ITK_WASM_NATIVE_WORKSPACE}/ITK-Wasm}
export ITK_WASM_WEBASSEMBLY_INTERFACE_BUILD_DIR=\${ITK_WASM_WEBASSEMBLY_INTERFACE_BUILD_DIR:-\${ITK_WASM_NATIVE_WORKSPACE}/ITK-Wasm-build}
mkdir -p \${ITK_WASM_WEBASSEMBLY_INTERFACE_BUILD_DIR} || die "Could not create ITK-Wasm build directory"
`

  fs.writeFileSync(itkWasmEnvBashPath, content)
}

export default generateItkWasmEnvBash
