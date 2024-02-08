import fs from 'fs'
import path from 'path'

import ProjectSpec from '../project-spec.js'

function generateCMakelists(project: ProjectSpec) {
  const cmakelistsPath = path.join(project.directory, 'CMakeLists.txt')
  if (fs.existsSync(cmakelistsPath)) {
    return
  }

  const content = `cmake_minimum_required(VERSION 3.16)
project(${project.name} LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)

find_package(ITK REQUIRED COMPONENTS
  WebAssemblyInterface
)
include(\${ITK_USE_FILE})

enable_testing()

# Begin create-itk-wasm added pipelines.
# End create-itk-wasm added pipelines.
`
  fs.writeFileSync(cmakelistsPath, content)
}

export default generateCMakelists
