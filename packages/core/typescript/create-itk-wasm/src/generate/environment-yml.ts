import fs from 'fs'
import path from 'path'

import ProjectSpec from '../project-spec.js'

function generateEnvironmentYml(project: ProjectSpec) {
  const environmentYmlPath = path.join(project.directory, 'environment.yml')
  if (fs.existsSync(environmentYmlPath)) {
    return
  }

  const content = `name: ${project.name}
channels:
  - conda-forge
dependencies:
  - pytest
  - python=3.11
  - pip
  - pip:
    - hatch
`
  fs.writeFileSync(environmentYmlPath, content)
}

export default generateEnvironmentYml
