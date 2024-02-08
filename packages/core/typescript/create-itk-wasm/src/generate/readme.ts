import fs from 'fs'
import path from 'path'

import ProjectSpec from '../project-spec.js'

function generateReadme(project: ProjectSpec) {
  const readmePath = path.join(project.directory, 'README.md')
  if (fs.existsSync(readmePath)) {
    return
  }

  const contents = `# ${project.name}

${project.packageDescription}
`
  fs.writeFileSync(readmePath, contents)
}

export default generateReadme
