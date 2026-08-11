import fs from 'fs'
import path from 'path'

import ProjectSpec from '../project-spec.js'

function generatePnpmWorkspace(project: ProjectSpec) {
  const pnpmWorkspacePath = path.join(project.directory, 'pnpm-workspace.yaml')
  if (fs.existsSync(pnpmWorkspacePath)) {
    return
  }

  // todo: this path could be parameterized, e.g. 'wasm/typescript'
  // pnpm 11 fails the install outright when a dependency's build scripts are
  // ignored, so allow the ones itk-wasm pulls in up front. Do not also list
  // these under the pnpm 10 spelling, onlyBuiltDependencies: pnpm 11 weighs
  // that key when deciding whether node_modules is stale but never writes it
  // to .modules.yaml, so every later install sees a settings change and
  // demands a modules purge, which aborts with no TTY.
  const content = `packages:
  - 'typescript'

allowBuilds:
  esbuild: true
  protobufjs: true
`
  fs.writeFileSync(pnpmWorkspacePath, content)
}

export default generatePnpmWorkspace
