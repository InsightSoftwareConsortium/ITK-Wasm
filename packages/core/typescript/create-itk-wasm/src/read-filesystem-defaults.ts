import path from 'path'
import fs from 'fs'

import ProjectSpec from './project-spec.js'

function readFilesystemDefaults(project: ProjectSpec): ProjectSpec {
  if (!project.name) {
    project.name = path
      .basename(process.cwd())
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
  }

  if (!project.directory) {
    if (path.basename(process.cwd()) === project.name) {
      project.directory = process.cwd()
    } else {
      project.directory = path.join(process.cwd(), project.name)
    }
  }

  const packageJsonPath = path.join(project.directory, 'package.json')
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    if (!project.name) {
      project.name = packageJson.name.substring(0, packageJson.name.length - 6)
    }
    if (!project.packageDescription) {
      project.packageDescription = packageJson.description
    }
    if (!project.author) {
      project.author = packageJson.author
    }
    if (
      !project.repositoryUrl &&
      packageJson.repository &&
      packageJson.repository.url
    ) {
      project.repositoryUrl = packageJson.repository.url
    }
    if (!project.license && packageJson.license) {
      project.license = packageJson.license
    }
  }

  return project
}

export default readFilesystemDefaults
