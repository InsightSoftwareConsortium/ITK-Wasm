import fs from 'fs'
import path from 'path'

import ProjectSpec from '../project-spec.js'

function generatePnpmWorkspace(project: ProjectSpec) {
  const pnpmWorkspacePath = path.join(project.directory, 'pnpm-workspace.yaml')
  if (fs.existsSync(pnpmWorkspacePath)) {
    return
  }

  // todo: this path could be parameterized, e.g. 'wasm/typescript'
  const content = `packages:
  - 'typescript'
`
  fs.writeFileSync(pnpmWorkspacePath, content)
}

export default generatePnpmWorkspace
